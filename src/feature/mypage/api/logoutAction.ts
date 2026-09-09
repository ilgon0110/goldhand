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

    // session이 실제 인증 판단 기준이지만, accessToken 발급도 아직 병행 중이라(Phase 6 전) 둘 다 지운다.
    cookies().set('session', '', expiredCookieOptions);
    cookies().set('accessToken', '', expiredCookieOptions);

    return { response: 'ok', message: '로그아웃이 성공하였습니다.' };
  } catch (error) {
    console.error('Logout error:', error);
    return { response: 'ng', message: '로그아웃 중 오류가 발생했습니다.' };
  }
}
