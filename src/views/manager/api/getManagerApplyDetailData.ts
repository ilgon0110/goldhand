import type { IManagerApplyDetailResponseData } from '@/src/shared/types';
import { authFetcher } from '@/src/shared/utils/fetcher.server';

export const getManagerApplyDetailData = async ({ docId }: { docId: string }) => {
  const res = await authFetcher<IManagerApplyDetailResponseData>(`/api/manager/detail?docId=${docId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-store',
  });

  return res;
};
