import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { verifySessionCookie } from '@/src/shared/lib/server';
import type { INotificationDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponsePostBody {
  response: 'ng' | 'ok';
  message: string;
  type: string;
  docId: string;
}

export async function POST(req: Request) {
  const adminDB = getAdminFirestore(firebaseAdminApp);

  // 요청 본문의 userId를 신뢰하지 않고, session 쿠키를 검증해 얻은 uid만 사용한다
  // (그렇지 않으면 누구나 임의 userId로 남의 알림을 읽음 처리할 수 있다).
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (session == null || session.value === '') {
    return typedJson<IResponsePostBody>(
      { response: 'ng', message: '로그인이 필요합니다.', type: '', docId: '' },
      { status: 401 },
    );
  }

  let userId: string;
  try {
    userId = (await verifySessionCookie(session.value)).uid;
  } catch {
    return typedJson<IResponsePostBody>(
      { response: 'ng', message: '인증에 실패했습니다.', type: '', docId: '' },
      { status: 401 },
    );
  }

  const { notificationId, markAsRead } = await req.json();

  if (markAsRead) {
    // 모든 알림 읽음처리
    try {
      const notificationsSnapshot = await adminDB
        .collection('notifications')
        .where('userId', '==', userId)
        .where('isRead', '==', false)
        .get();
      const batch = adminDB.batch();
      notificationsSnapshot.forEach(doc => {
        batch.update(doc.ref, { isRead: true });
      });
      await batch.commit();

      return typedJson<IResponsePostBody>(
        {
          response: 'ok',
          message: '알림 읽음처리 성공!',
          type: 'all_read',
          docId: '',
        },
        { status: 200 },
      );
    } catch {
      return typedJson<IResponsePostBody>(
        { response: 'ng', message: '알림 읽음처리 실패!', type: '', docId: '' },
        { status: 500 },
      );
    }
  }

  // target notification 조회
  const notificationDocRef = adminDB.collection('notifications').doc(notificationId);

  if (notificationDocRef == null) {
    return typedJson<IResponsePostBody>(
      {
        response: 'ng',
        message: '존재하지 않는 알림입니다.',
        type: '',
        docId: '',
      },
      { status: 404 },
    );
  }

  const notificationDocSnap = await notificationDocRef.get();
  if (!notificationDocSnap.exists) {
    return typedJson<IResponsePostBody>(
      {
        response: 'ng',
        message: '존재하지 않는 알림입니다.',
        type: '',
        docId: '',
      },
      { status: 404 },
    );
  }

  const notificationData = notificationDocSnap.data() as INotificationDetailData;
  if (notificationData.userId !== userId) {
    return typedJson<IResponsePostBody>(
      { response: 'ng', message: '해당 알림에 접근할 권한이 없습니다.', type: '', docId: '' },
      { status: 403 },
    );
  }

  // 알림 읽음처리
  try {
    await notificationDocRef.update({
      ...notificationData,
      isRead: true,
    });

    return typedJson<IResponsePostBody>(
      { response: 'ok', message: '알림 읽음처리 성공!', type: notificationData.type, docId: notificationData.docId },
      { status: 200 },
    );
  } catch (error) {
    console.error('알림 읽음처리 에러!! ', error);

    const errorCode =
      error != null && typeof error === 'object' && 'code' in error && typeof error.code === 'string'
        ? error.code
        : 'unknown_error';
    return typedJson<IResponsePostBody>({ response: 'ng', message: errorCode, type: '', docId: '' }, { status: 500 });
  }
}
