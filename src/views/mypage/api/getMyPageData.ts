import type { IMyPageResponseData } from '@/src/shared/types';
import { authFetcher } from '@/src/shared/utils/fetcher.server';

export const getMyPageData = async (): Promise<IMyPageResponseData> => {
  const res = await authFetcher<IMyPageResponseData>(`/api/mypage`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  return res;
};
