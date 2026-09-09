import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';

import { firebaseAdminApp } from '@/src/shared/config/firebase-admin';
import { verifySessionCookie } from '@/src/shared/lib/server';
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
  const session = cookieStore.get('session');
  const adminApp = getAdminAuth(firebaseAdminApp);

  if (session == null || session.value === '') {
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

  let uid: string;

  try {
    uid = (await verifySessionCookie(session.value)).uid;
  } catch (error) {
    // verifySessionCookie는 세션의 유효성만 검증한다. auth/id-token-expired, auth/argument-error,
    // auth/session-cookie-revoked 등 실패 사유가 무엇이든 "지금 이 세션으로는 인증할 수 없다"는
    // 의미는 동일하므로, 알려진 코드를 화이트리스트로 나열하지 않고 검증 실패 자체를 곧바로
    // 비로그인 상태로 처리한다. 진짜 서버 장애(500)는 이 단계가 아니라 검증 이후 DB 조회
    // 단계(아래 catch)에서만 판단한다.
    console.error('Error verifying session cookie:', error);
    return userJson(
      {
        response: 'ng',
        message: '세션이 유효하지 않습니다.',
        userData: null,
        isLinked: false,
      },
      200,
    );
  }

  try {
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

    // 세션은 유효했지만 Firebase Auth에서 유저 레코드가 이미 삭제된 경우(데이터 정합성 문제)로,
    // 서버 장애가 아니다.
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
