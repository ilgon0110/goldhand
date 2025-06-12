import { getAuth } from 'firebase/auth';
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
      },
      { status: 403 },
    );
  }

  try {
    const decodedToken = await getAdminAuth().verifyIdToken(accessToken.value);
    const uid = decodedToken.uid;
    console.log('uid:', uid);

    if (uid === undefined) {
      return typedJson<IResponseBody>(
        {
          response: 'ng',
          message: '사용자 식별 아이디가 존재하지 않습니다.',
          accessToken: null,
          userData: null,
        },
        { status: 403 },
      );
    }
    const app = firebaseApp;
    const auth = getAuth();
    const db = getFirestore(app);

    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data() as UserDetailData;

      return typedJson<IResponseBody>(
        {
          response: 'ok',
          message: '로그인 정보 확인',
          accessToken: accessToken.value,
          userData: { ...userData, uid },
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
      },
      { status: 404 },
    );
  } catch (error) {
    console.error('Error fetching user data:', error);

    if (error != null && typeof error === 'object' && 'code' in error && error.code === 'auth/id-token-expired') {
      return typedJson<IResponseBody>(
        {
          response: 'unAuthorized',
          message: error.code,
          accessToken: null,
          userData: null,
        },
        { status: 401 },
      );
    }

    return typedJson<IResponseBody>(
      {
        response: 'ng',
        message: '해당 토큰을 가진 유저가 존재하지 않습니다.',
        accessToken: null,
        userData: null,
      },
      { status: 403 },
    );
  }
}
