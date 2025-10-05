import { parse } from 'cookie';
import { headers } from 'next/headers';

import { apiUrl } from '@/src/shared/config';
import type { IMyPageResponseData } from '@/src/shared/types';

export const getMyPageData = async (): Promise<IMyPageResponseData> => {
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

  // const res = await authFetcher('/api/mypage', {
  //   cache: 'no-store',
  // })

  return res.json();
};
