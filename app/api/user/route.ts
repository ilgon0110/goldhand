import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import type { IUserDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
  userData: IUserDetailData | null;
  isLinked: boolean;
}

function userJson(body: IResponseBody, status: number) {
  return typedJson<IResponseBody>(body, {
    status,
    headers: { 'Cache-Control': 'private, no-store' },
  });
}

export async function GET() {
  // 현재 로그인된 유저의 uid를 가져온다.
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');
  const adminApp = getAdminAuth(firebaseAdminApp);

  if (accessToken == null || accessToken.value === '') {
    return userJson(
      {
        response: 'ng',
        message: '로그인 토큰이 존재하지 않습니다.',
        userData: null,
        isLinked: false,
      },
      200,
    );
  }

  try {
    const decodedToken = await adminApp.verifyIdToken(accessToken.value);
    const uid = decodedToken.uid;

    if (uid === undefined) {
      return userJson(
        {
          response: 'ng',
          message: '사용자 식별 아이디가 존재하지 않습니다.',
          userData: null,
          isLinked: false,
        },
        200,
      );
    }
    const db = getAdminFirestore(firebaseAdminApp);

    const userDocRef = db.collection('users').doc(uid);
    const userDocSnap = await userDocRef.get();

    // userData의 isDeleted가 true인 경우, 삭제된 유저로 간주하고 처리
    if (userDocSnap.exists && userDocSnap.data()!.isDeleted) {
      return userJson(
        {
          response: 'ng',
          message: '해당 uid를 가진 유저는 현재 탈퇴한 상태입니다.',
          userData: null,
          isLinked: false,
        },
        200,
      );
    }

    if (userDocSnap.exists) {
      const userData = userDocSnap.data() as IUserDetailData;
      const userRecord = await adminApp.getUser(uid);
      const providerIds = userRecord.providerData.map(provider => provider.providerId);
      const hasEmail = providerIds.includes('password');
      const hasPhone = providerIds.includes('phone');

      return userJson(
        {
          response: 'ok',
          message: '로그인 정보 확인',
          userData: { ...userData, userId: uid },
          isLinked: hasEmail && hasPhone,
        },
        200,
      );
    }

    return userJson(
      {
        response: 'ng',
        message: '해당 uid를 가진 유저가 존재하지 않습니다.',
        userData: null,
        isLinked: false,
      },
      200,
    );
  } catch (error) {
    console.error('Error fetching user data:', error);

    const errorCode =
      typeof error === 'object' && error != null && 'code' in error && typeof error.code === 'string'
        ? error.code
        : 'unknown_error';

    if (errorCode === 'auth/invalid-id-token') {
      return userJson(
        {
          response: 'ng',
          message: errorCode,
          userData: null,
          isLinked: false,
        },
        200,
      );
    }

    if (errorCode === 'auth/id-token-expired') {
      return userJson(
        {
          response: 'ng',
          message: errorCode,
          userData: null,
          isLinked: false,
        },
        200,
      );
    }

    // db에서 유저정보를 삭제한 경우
    if (errorCode === 'auth/user-not-found') {
      return userJson(
        {
          response: 'ng',
          message: errorCode,
          userData: null,
          isLinked: false,
        },
        200,
      );
    }

    return userJson(
      {
        response: 'ng',
        message: errorCode,
        userData: null,
        isLinked: false,
      },
      500,
    );
  }
}
