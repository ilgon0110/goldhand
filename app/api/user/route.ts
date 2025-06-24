import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

import { firebaseApp } from '@/src/shared/config/firebase';
import type { UserDetailData } from '@/src/shared/types';
import { typedJson } from '@/src/shared/utils';

interface IResponseBody {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
  accessToken: string | null;
  userData: UserDetailData | null;
  isLinked: boolean;
}

export async function GET() {
  // 현재 로그인된 유저의 uid를 가져온다.
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  if (!accessToken) {
    return typedJson<IResponseBody>(
      {
        response: 'ng',
        message: '로그인 토큰이 존재하지 않습니다.',
        accessToken: null,
        userData: null,
        isLinked: false,
      },
      { status: 403 },
    );
  }

  try {
    const decodedToken = await getAdminAuth().verifyIdToken(accessToken.value);
    const uid = decodedToken.uid;

    if (uid === undefined) {
      return typedJson<IResponseBody>(
        {
          response: 'ng',
          message: '사용자 식별 아이디가 존재하지 않습니다.',
          accessToken: null,
          userData: null,
          isLinked: false,
        },
        { status: 403 },
      );
    }
    const app = firebaseApp;
    const db = getFirestore(app);

    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data() as UserDetailData;
      const userRecord = await getAdminAuth().getUser(uid);
      const providerIds = userRecord.providerData.map(provider => provider.providerId);
      const hasEmail = providerIds.includes('password');
      const hasPhone = providerIds.includes('phone');

      return typedJson<IResponseBody>(
        {
          response: 'ok',
          message: '로그인 정보 확인',
          accessToken: accessToken.value,
          userData: { ...userData, uid },
          isLinked: hasEmail && hasPhone,
        },
        { status: 200 },
      );
    }

    return typedJson<IResponseBody>(
      {
        response: 'ng',
        message: '해당 uid를 가진 유저가 존재하지 않습니다.',
        accessToken: accessToken.value,
        userData: null,
        isLinked: false,
      },
      { status: 403 },
    );
  } catch (error) {
    console.error('Error fetching user data:', error);

    const errorCode =
      typeof error === 'object' && error != null && 'code' in error && typeof error.code === 'string'
        ? error.code
        : 'unknown_error';
    if (typeof error === 'object' && error != null && 'code' in error && error.code === 'auth/invalid-id-token') {
      return typedJson<IResponseBody>(
        {
          response: 'unAuthorized',
          message: error.code,
          accessToken: null,
          userData: null,
          isLinked: false,
        },
        { status: 401 },
      );
    }

    return typedJson<IResponseBody>(
      {
        response: 'ng',
        message: errorCode,
        accessToken: null,
        userData: null,
        isLinked: false,
      },
      { status: 500 },
    );
  }
}
