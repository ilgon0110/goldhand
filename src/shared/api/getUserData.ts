import { parse } from 'cookie';
import { headers } from 'next/headers';

import type { IUserData } from '@/src/shared/types';

import { apiUrl } from '../config';

export async function getUserData(): Promise<IUserData> {
  const rawCookie = headers().get('cookie') || '';
  const cookiesObj = parse(rawCookie);
  const accessToken = cookiesObj['accessToken'];

  const res: Response = await fetch(`${apiUrl}/api/user`, {
    headers: {
      'Content-Type': 'application/json',
      Cookie: `accessToken=${accessToken}`,
    },
    cache: 'no-store',
  });

  // if (!res.ok) {
  //   throw new Error("데이터 fetch 실패!!");
  // }

  return res.json();
}
