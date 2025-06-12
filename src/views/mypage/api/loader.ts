import { parse } from 'cookie';
import { headers } from 'next/headers';

import type { IMyPageData } from '@/src/shared/types';

export const getMyPageData = async (): Promise<IMyPageData> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' ? process.env.NEXT_PUBLIC_API_URL : 'http://127.0.0.1:3000';

  const rawCookie = headers().get('cookie') || '';
  const cookiesObj = parse(rawCookie);
  const accessToken = cookiesObj['accessToken'];

  const res = await fetch(`${apiUrl}/api/mypage`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `accessToken=${accessToken}`,
    },
    cache: 'no-store',
  });

  return res.json();
};
