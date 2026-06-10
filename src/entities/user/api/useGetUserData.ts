import type { UseQueryOptions } from '@tanstack/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getUserData } from '@/src/shared/api/getUserData';
import { userKeys } from '@/src/shared/config/queryKeys';
import type { IUserResponseData } from '@/src/shared/types';

type TUseGetUserDataQuery = Omit<UseQueryOptions<IUserResponseData>, 'queryFn' | 'queryKey'>;

export const useGetUserData = (options?: TUseGetUserDataQuery) => {
  return useSuspenseQuery({
    queryKey: userKeys.all,
    queryFn: getUserData,
    ...options,
  });
};
