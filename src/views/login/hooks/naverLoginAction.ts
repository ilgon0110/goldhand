'use server';

import { cookies } from 'next/headers';

import { apiUrl } from '@/src/shared/config';

interface IResponse {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
  email?: string;
  redirectTo?: string;
}

export async function naverLoginAction(access_token: string): Promise<IResponse> {
  try {
    const postData = await (
      await fetch(`${apiUrl}/api/auth/naver`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token }),
      })
    ).json();

    if (postData.accessToken) {
      // Set the access token in cookies
      cookies().set('accessToken', postData.accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 7 days,
        sameSite: 'strict',
      });
    }

    return postData;
  } catch (error) {
    console.error('Error fetching post data:', error);
    throw error;
  }
}
