import { cookies } from 'next/headers';

import type { IUserResponseData } from '@/src/shared/types';

import { fetcher } from '../utils/fetcher.client';
import { authFetcher } from '../utils/fetcher.server';

/*
서버 컴포넌트나 서버 액션에서 user 데이터를 가져올 때 사용
*/
export async function getUserData(): Promise<IUserResponseData> {
  const cookieStore = cookies();
  const userData = await fetcher<IUserResponseData>('/api/user', {
    cache: 'no-cache',
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return userData;
}

// 로그인이 되어있을 때 로그인한 유저의 데이터를 가져올 때 사용
export async function getUserLoginData(): Promise<IUserResponseData> {
  const result = await authFetcher<IUserResponseData>('/api/user/login', {
    cache: 'no-store',
  });

  return result;
}
