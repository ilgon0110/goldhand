import type { IUserResponseData } from '@/src/shared/types';

import { authFetcher } from '../utils/fetcher.server';

/*
서버 컴포넌트나 서버 액션에서 user 데이터를 가져올 때 사용
*/
export async function getUserData(): Promise<IUserResponseData> {
  const result = await authFetcher<IUserResponseData>('/api/user', {
    cache: 'no-store',
    next: { revalidate: 0 },
  });

  return result;
}
