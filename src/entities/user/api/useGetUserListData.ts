import type { UseQueryOptions } from '@tanstack/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';

import { userListKeys } from '@/src/shared/config/queryKeys';

import { getUserListData } from './getUserListData';

type TUserListData = Awaited<ReturnType<typeof getUserListData>>;
type TUseGetUserListDataQuery = Omit<UseQueryOptions<TUserListData>, 'queryFn' | 'queryKey'>;

export const useGetUserListData = (params: { page: number }, options?: TUseGetUserListDataQuery) => {
  return useSuspenseQuery({
    queryKey: userListKeys.list(params),
    queryFn: () => getUserListData(params),
    ...options,
  });
};
