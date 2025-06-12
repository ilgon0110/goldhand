import { parse } from 'cookie';
import { headers } from 'next/headers';
import type { SearchParams } from 'nuqs/server';

import type { IUserData } from '@/src/shared/types';

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export async function getUserData(): Promise<IUserData> {
  const apiUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' ? process.env.NEXT_PUBLIC_API_URL : 'http://127.0.0.1:3000';

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

export async function getSignUpData() {
  const apiUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' ? process.env.NEXT_PUBLIC_API_URL : 'http://127.0.0.1:3000';

  const rawCookie = headers().get('cookie') || '';
  const cookiesObj = parse(rawCookie);
  const accessToken = cookiesObj['accessToken'];

  const res: Response = await fetch(`${apiUrl}/api/signup`, {
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
