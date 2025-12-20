import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';

import { NOTI_LIMIT } from '@/src/shared/config';
import { firebaseApp } from '@/src/shared/config/firebase';
import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { INotificationDetailData, INotificationResponseData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

const defaultData: INotificationDetailData[] = [];

export async function GET(request: NextRequest) {
  // 현재 로그인된 유저의 uid를 가져온다.
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  if (!accessToken) {
    return typedJson<INotificationResponseData>(
      {
        response: 'ng',
        message: '로그인 토큰이 존재하지 않습니다.',
        data: defaultData,
        nextCursor: null,
      },
      { status: 403 },
    );
  }

  let uid;
  try {
    const decodedToken = await getAdminAuth(firebaseAdminApp).verifyIdToken(accessToken.value);
    uid = decodedToken.uid;

    if (uid === undefined) {
      return typedJson<INotificationResponseData>(
        {
          response: 'ng',
          message: '사용자 식별 아이디가 존재하지 않습니다.',
          data: defaultData,
          nextCursor: null,
        },
        { status: 403 },
      );
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    if (error != null && typeof error == 'object' && 'code' in error && error.code === 'auth/id-token-expired') {
      return typedJson<INotificationResponseData>(
        {
          response: 'ng',
          message: '로그인 토큰이 만료되었습니다.',
          data: defaultData,
          nextCursor: null,
        },
        { status: 403 },
      );
    }
    return typedJson<INotificationResponseData>({
      response: 'ng',
      message: '로그인 토큰 검증 중 오류가 발생했습니다.',
      data: defaultData,
      nextCursor: null,
    });
  }

  try {
    const db = getFirestore(firebaseApp);
    const adminDB = getAdminFirestore(firebaseAdminApp);

    // 사용자 데이터 가져오기
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return typedJson<INotificationResponseData>({
        response: 'ng',
        message: '사용자 데이터가 존재하지 않습니다.',
        data: defaultData,
        nextCursor: null,
      });
    }

    // 탈퇴한 유저인지 확인
    if (userDocSnap.data()?.isDeleted) {
      return typedJson<INotificationResponseData>(
        {
          response: 'ng',
          message: '탈퇴한 유저입니다.',
          data: defaultData,
          nextCursor: null,
        },
        { status: 403 },
      );
    }

    // page기반 페이지네이션으로 알림 데이터 가져오기
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') == null ? 1 : parseInt(searchParams.get('page')!, 10);
    const startIndex = Math.max(0, page - 1);

    // notifications collections에서 userId가 일치하는 것만 가져오기
    const notificationsSnapshot = await adminDB
      .collection('notifications')
      .where('userId', '==', uid)
      .orderBy('createdAt', 'desc')
      .offset(startIndex)
      .limit(NOTI_LIMIT)
      .get();

    const notificationsData = notificationsSnapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: {
        seconds: doc.data().createdAt._seconds,
        nanoseconds: doc.data().createdAt._nanoseconds,
      },
    })) as INotificationDetailData[];

    // 다음 페이지 존재 여부 확인: 현재 페이지 끝에서 1개만 더 조회해 확인
    let nextCursor: string | null = null;
    if (notificationsSnapshot.size === NOTI_LIMIT) {
      const nextSnapshot = await adminDB
        .collection('notifications')
        .where('userId', '==', uid)
        .orderBy('createdAt', 'desc')
        .offset(startIndex + NOTI_LIMIT)
        .limit(1)
        .get();
      nextCursor = nextSnapshot.size > 0 ? String(page + NOTI_LIMIT) : null;
    }

    // 최종 데이터 구성
    return typedJson<INotificationResponseData>({
      response: 'ok',
      message: '알림 데이터 조회 성공',
      data: notificationsData,
      nextCursor,
    });
  } catch (error) {
    console.error('Error fetching notification data:', error);
    return typedJson<INotificationResponseData>({
      response: 'ng',
      message: '알림 데이터를 가져오는 중 오류가 발생했습니다.',
      data: defaultData,
      nextCursor: null,
    });
  }
}
