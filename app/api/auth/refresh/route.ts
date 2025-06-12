import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';

import { typedJson } from '@/src/shared/utils';

interface IResponseBody {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
  accessToken: string | null;
}

export async function POST(): Promise<Response> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken');

  if (!accessToken) {
    return typedJson<IResponseBody>(
      {
        response: 'unAuthorized',
        message: '로그인되지 않았습니다.',
        accessToken: null,
      },
      { status: 401 },
    );
  }
  // firebase에서 accessToken을 검증하는 로직
  try {
    await getAdminAuth().verifyIdToken(accessToken.value);

    return typedJson<IResponseBody>(
      {
        response: 'ok',
        message: '로그인 확인',
        accessToken: accessToken.value,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error != null && typeof error === 'object' && 'code' in error && error.code === 'auth/id-token-expired') {
      console.log('토큰 만료됨');
      return typedJson<IResponseBody>(
        { response: 'unAuthorized', message: '토큰 만료됨', accessToken: null },
        { status: 401 },
      );
    }

    return typedJson<IResponseBody>(
      {
        response: 'ng',
        message: '토큰 검증 실패',
        accessToken: null,
      },
      { status: 500 },
    );
  }
}
