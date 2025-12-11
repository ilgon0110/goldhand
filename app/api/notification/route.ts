import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

import { firebaseApp } from '@/src/shared/config/firebase';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { INotificationDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponseBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
  data: INotificationDetailData[];
}

const defaultData: INotificationDetailData[] = [];

export async function GET() {
  // 현재 로그인된 유저의 uid를 가져온다.
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  if (!accessToken) {
    return typedJson<IResponseBody>(
      {
        response: 'ng',
        message: '로그인 토큰이 존재하지 않습니다.',
        data: defaultData,
      },
      { status: 403 },
    );
  }

  let uid;
  try {
    const decodedToken = await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken.value);
    uid = decodedToken.uid;

    if (uid === undefined) {
      return typedJson<IResponseBody>(
        {
          response: 'ng',
          message: '사용자 식별 아이디가 존재하지 않습니다.',
          data: defaultData,
        },
        { status: 403 },
      );
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    if (error != null && typeof error == 'object' && 'code' in error && error.code === 'auth/id-token-expired') {
      return typedJson<IResponseBody>(
        {
          response: 'expired',
          message: '로그인 토큰이 만료되었습니다.',
          data: defaultData,
        },
        { status: 403 },
      );
    }
    return typedJson<IResponseBody>({
      response: 'ng',
      message: '로그인 토큰 검증 중 오류가 발생했습니다.',
      data: defaultData,
    });
  }

  try {
    const db = getFirestore(firebaseApp);
    const adminDB = getAdminFirestore(firebaseAdminApp);

    // 사용자 데이터 가져오기
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return typedJson<IResponseBody>({
        response: 'ng',
        message: '사용자 데이터가 존재하지 않습니다.',
        data: defaultData,
      });
    }

    // 탈퇴한 유저인지 확인
    if (userDocSnap.data()?.isDeleted) {
      return typedJson<IResponseBody>(
        {
          response: 'ng',
          message: '탈퇴한 유저입니다.',
          data: defaultData,
        },
        { status: 403 },
      );
    }

    // notifications collections에서 userId가 일치하는 것만 가져오기
    const notificationsSnapshot = await adminDB
      .collection('notifications')
      .orderBy('createdAt', 'desc')
      .where('userId', '==', uid)
      .get();
    const notificationsData = notificationsSnapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: {
        seconds: doc.data().createdAt._seconds,
        nanoseconds: doc.data().createdAt._nanoseconds,
      },
    })) as INotificationDetailData[];

    // 최종 데이터 구성
    return typedJson<IResponseBody>({
      response: 'ok',
      message: '알림 데이터 조회 성공',
      data: notificationsData,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return typedJson<IResponseBody>({
      response: 'ng',
      message: '알림 데이터를 가져오는 중 오류가 발생했습니다.',
      data: defaultData,
    });
  }
}
