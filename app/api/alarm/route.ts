import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { INotificationDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponsePostBody {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
  type: string;
  docId: string;
}

export async function POST(req: Request) {
  const adminDB = getAdminFirestore(firebaseAdminApp);
  const { userId, notificationId, markAsRead } = await req.json();
  if (userId == null) {
    return typedJson<IResponsePostBody>(
      {
        response: 'ng',
        message: '필수 파라미터가 제공되지 않았습니다.',
        type: '',
        docId: '',
      },
      { status: 400 },
    );
  }

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

  // 알림 읽음처리
  try {
    const notificationData = notificationDocSnap.data() as INotificationDetailData;
    console.log('알림 읽음처리 대상 데이터: ', notificationData);
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
