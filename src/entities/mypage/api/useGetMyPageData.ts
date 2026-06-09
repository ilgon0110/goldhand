import type { UseQueryOptions } from '@tanstack/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';

import { myPageKeys } from '@/src/shared/config/queryKeys';
import type { IMyPageResponseData } from '@/src/shared/types';
import { authFetcher } from '@/src/shared/utils/fetcher.server';

type TUseGetMyPageDataQuery = Omit<UseQueryOptions<IMyPageResponseData>, 'queryFn' | 'queryKey'>;

export const getMyPageData = async () => {
  const response = await authFetcher<IMyPageResponseData>(`/api/mypage`);

  return response;
};

export const useGetMyPageData = (options?: TUseGetMyPageDataQuery) => {
  const res = useSuspenseQuery({
    queryKey: myPageKeys.all,
    queryFn: getMyPageData,
    ...options,
  });

  return res;
};
