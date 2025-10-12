import type { IManagerApplyListData } from '@/src/shared/types';
import { authFetcher } from '@/src/shared/utils/fetcher.server';

export const getManagerListData = async (page: number) => {
  const res = await authFetcher<IManagerApplyListData>(`/api/manager/list?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  return res;
};
