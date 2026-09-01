import type { UseQueryOptions } from '@tanstack/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';

import { userKeys } from '@/src/shared/config/queryKeys';
import type { IUserResponseData } from '@/src/shared/types';
import { fetcher } from '@/src/shared/utils/fetcher.client';

type TUseGetUserDataQuery = Omit<UseQueryOptions<IUserResponseData>, 'queryFn' | 'queryKey'>;

export const useGetUserData = (options?: TUseGetUserDataQuery) => {
  return useSuspenseQuery({
    queryKey: userKeys.all,
    queryFn: () => fetcher<IUserResponseData>('/api/user', { cache: 'no-store' }),
    ...options,
  });
};
