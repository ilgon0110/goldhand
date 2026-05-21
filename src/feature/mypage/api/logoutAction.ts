'use server';

import { cookies } from 'next/headers';

interface ILogoutResponse {
  response: 'ok' | 'ng';
  message: string;
}

export async function logoutAction(): Promise<ILogoutResponse> {
  try {
    cookies().set('accessToken', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
    });

    return { response: 'ok', message: '로그아웃이 성공하였습니다.' };
  } catch (error) {
    console.error('Logout error:', error);
    return { response: 'ng', message: '로그아웃 중 오류가 발생했습니다.' };
  }
}
