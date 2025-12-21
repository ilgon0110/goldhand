import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

import { notify } from '@/src/shared/lib/alarm';
import type { INotificationDetailData } from '@/src/shared/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-webhook-secret');
  const expected = process.env.WEBHOOK_SECRET;

  if (expected == null || secret == null || secret !== expected) {
    return new Response('unauthorized', { status: 401 });
  }

  let body;
  try {
    body = (await req.json()) as INotificationDetailData;
  } catch (err) {
    return new Response('invalid body', { status: 400 });
  }

  // Expected DTO: { userId, type, message, isRead, docId, commentId?, comment?, title? }
  const notificationId = body.id ?? `${Date.now()}-${uuidv4()}`;

  const payload: INotificationDetailData = {
    id: notificationId,
    type: body.type ?? 'generic',
    userId: body.userId,
    docId: body.docId,
    message: body.message ?? '내용 없음',
    createdAt: body.createdAt ?? {
      seconds: Math.floor(Date.now() / 1000),
      nanoseconds: (Date.now() % 1000) * 1_000_000,
    },
    isRead: body.isRead ?? false,
  };

  try {
    // userId + channel 기반 전송
    await notify(payload, { channel: payload.type, userId: body.userId });

    // // FCM 로직은 추후 구현: send to FCM if needed

    return new Response('ok', { status: 200 });
  } catch (err) {
    console.error('push notify error', err);
    return new Response('error', { status: 500 });
  }
}
