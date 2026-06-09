import type { UseSuspenseQueryOptions } from '@tanstack/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';

import { userKeys } from '@/src/shared/config/queryKeys';
import type { IUserResponseData } from '@/src/shared/types';
import { authFetcher } from '@/src/shared/utils/fetcher.server';

type TUseGetUserDataQuery = Omit<UseSuspenseQueryOptions<IUserResponseData>, 'queryFn' | 'queryKey'>;

export const getUserApiData = async () => {
  const result = await authFetcher<IUserResponseData>('/api/user');

  return result;
};

export const useGetUserData = (options?: TUseGetUserDataQuery) => {
  const res = useSuspenseQuery({
    queryKey: userKeys.all,
    queryFn: getUserApiData,
    ...options,
  });

  return res;
};
