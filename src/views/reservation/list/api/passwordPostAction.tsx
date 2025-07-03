'use server';

import { cookies } from 'next/headers';

import { apiUrl } from '@/src/shared/config';
import type { IConsultDetailData } from '@/src/shared/types';

interface IResponse {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
  data: IConsultDetailData;
  reservationToken: string | null;
}

export async function passwordPostAction(docId: string, password: string): Promise<IResponse> {
  try {
    const postData = await (
      await fetch(`${apiUrl}/api/consultDetail/password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ docId, password }),
      })
    ).json();

    if (postData.response === 'ok' && postData.reservationToken) {
      // Set the access token in cookies
      cookies().set('reservationToken', postData.reservationToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: 'strict',
      });
    }

    return postData;
  } catch (error) {
    console.error('Error fetching post password:', error);
    throw error;
  }
}
