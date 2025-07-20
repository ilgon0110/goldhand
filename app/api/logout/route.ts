import { cookies } from 'next/headers';

import { typedJson } from '@/src/shared/utils';

interface IResponsePostBody {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
}

export async function POST() {
  try {
    const res = setAuthCookie();
    return typedJson<IResponsePostBody>(
      {
        response: 'ok',
        message: '로그아웃이 성공하였습니다.',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Logout error:', error);
    return typedJson(
      {
        response: 'ng',
        message: '로그아웃 중 오류가 발생했습니다.',
      },
      { status: 500 },
    );
  }
}

function setAuthCookie() {
  const cookieStore = cookies();
  return cookieStore.set('accessToken', '', {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), // 만료
  });
}
