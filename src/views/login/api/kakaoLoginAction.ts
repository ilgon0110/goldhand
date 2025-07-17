'use server';

import type { UserCredential } from 'firebase/auth';
import { cookies } from 'next/headers';

import { apiUrl } from '@/src/shared/config';
import type { IUserDetailData } from '@/src/shared/types';

interface IResponse {
  response: 'ng' | 'ok' | 'rejoin';
  message: string;
  redirectTo: string;
  user: UserCredential | null;
  accessToken: string | null;
  email?: string | null;
  userData?: IUserDetailData | null;
}

export async function kakaoLoginAction(code: string): Promise<IResponse> {
  try {
    const postData = await (
      await fetch(`${apiUrl}/api/auth/kakao`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
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
