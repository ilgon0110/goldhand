import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { TChannel } from '@/src/shared/hooks/useAlarm';
import { addClient, getClient, listClients, removeClient, setClientUserId } from '@/src/shared/lib/alarm';
import { type INotificationDetailData, type IUserDetailData, NotificationType } from '@/src/shared/types';

export const runtime = 'nodejs';

const encoder = new TextEncoder();

function makeEvent(eventId: string, event: string, data: INotificationDetailData) {
  return `id: ${eventId}\nevent: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
}

async function checkAdmin() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');
  const adminApp = getAdminAuth(firebaseAdminApp);

  if (accessToken == null) return false;
  const decodedToken = await adminApp.verifyIdToken(accessToken.value);
  const uid = decodedToken.uid;

  const adminDB = getAdminFirestore(firebaseAdminApp);
  const userSnapshot = await adminDB.collection('users').doc(uid).get();
  if (!userSnapshot.exists) return false;
  const userData = userSnapshot.data() as IUserDetailData;
  return userData.grade === 'admin';
}

async function getUserId(): Promise<string> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken');
  const adminApp = getAdminAuth(firebaseAdminApp);

  if (accessToken == null) return '';
  const decodedToken = await adminApp.verifyIdToken(accessToken.value);
  const uid = decodedToken.uid;

  const adminDB = getAdminFirestore(firebaseAdminApp);
  const userSnapshot = await adminDB.collection('users').doc(uid).get();
  if (!userSnapshot.exists) return '';
  const userData = userSnapshot.data() as IUserDetailData;
  return userData.userId;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const channelsParam = url.searchParams.get('channels'); // "review,consult" 등
  const channels = channelsParam ? (channelsParam.split(',').map(s => s.trim()) as TChannel[]) : null;
  const op = url.searchParams.get('op'); // 디버그용: list, inspect, sendTest

  const stream = new ReadableStream({
    start(controller) {
      const clientId = `${Date.now()}-${uuidv4()}`;
      // add to shared clients map
      addClient({ id: clientId, controller, channels, userId: undefined });

      // 연결 확인 메시지 (event: connected)
      try {
        const connectedEvent = makeEvent(`${Date.now()}`, 'connected', {
          id: clientId,
          type: NotificationType.NEW_CONNECTION,
          message: 'SSE Connected',
          docId: '',
          userId: '',
          createdAt: {
            seconds: Math.floor(Date.now() / 1000),
            nanoseconds: (Date.now() % 1000) * 1_000_000,
          },
          isRead: false,
        });
        controller.enqueue(encoder.encode(connectedEvent));
      } catch {
        // 전송 실패 시 클라이언트 제거
        removeClient(clientId);
        return new Response('SSE Connection failed', { status: 500 });
      }

      // 비동기로 userId를 조회하여 매핑
      (async () => {
        try {
          const userId = await getUserId();
          if (userId) {
            setClientUserId(clientId, userId);
            // identify 이벤트 전송
            const identifiedEvent = makeEvent(`${Date.now()}`, 'identified', {
              id: clientId,
              type: NotificationType.NEW_CONNECTION,
              message: `SSE Identified: ${userId}`,
              docId: '',
              userId: userId,
              createdAt: {
                seconds: Math.floor(Date.now() / 1000),
                nanoseconds: (Date.now() % 1000) * 1_000_000,
              },
              isRead: false,
            });
            controller.enqueue(encoder.encode(identifiedEvent));
          }
        } catch (err) {
          // 사용자 정보 조회 실패 무시
        }
      })();

      // 종료 처리
      req.signal.addEventListener('abort', () => {
        removeClient(clientId);
        try {
          controller.close();
        } catch {
          // 이미 닫힌 경우
        }
      });
    },
    cancel() {
      // 브라우저가 닫혔을 때
      console.log('SSE stream cancelled by client');
    },
  });

  if (op === 'list') {
    const list = listClients();
    return new Response(JSON.stringify(list), { status: 200, headers: { 'Content-Type': 'text/event-stream' } });
  }

  // 디버그: 특정 클라이언트 검사 (controller는 직렬화 불가하므로 메타만)
  if (op === 'inspect') {
    const id = url.searchParams.get('id');
    if (!id) return new Response('id required', { status: 400 });
    const c = getClient(id);
    if (!c) return new Response('not found', { status: 404 });
    return new Response(
      JSON.stringify({
        id: c.id,
        channels: c.channels,
        userId: c.userId,
        controllerMethods: ['enqueue', 'close', 'error'],
      }),
      { status: 200, headers: { 'Content-Type': 'text/event-stream' } },
    );
  }

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

// notifyAlarm is provided by shared alarm module
