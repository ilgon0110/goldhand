'use server';

import { cookies } from 'next/headers';

interface ILogoutResponse {
  response: 'ng' | 'ok';
  message: string;
}

export async function logoutAction(): Promise<ILogoutResponse> {
  try {
    const expiredCookieOptions = {
      httpOnly: true,
      path: '/',
      maxAge: 0,
      sameSite: 'strict' as const,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
    };

    cookies().set('session', '', expiredCookieOptions);
    // accessToken은 더 이상 발급하지 않지만, 이전에 발급받아 브라우저에 남아있는 사용자를 위해 계속 지워준다.
    cookies().set('accessToken', '', expiredCookieOptions);

    return { response: 'ok', message: '로그아웃이 성공하였습니다.' };
  } catch (error) {
    console.error('Logout error:', error);
    return { response: 'ng', message: '로그아웃 중 오류가 발생했습니다.' };
  }
}
