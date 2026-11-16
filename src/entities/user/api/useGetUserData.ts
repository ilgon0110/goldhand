import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { clientGet, jsonOrThrow, type TGet } from '@/src/shared/api/request';
import { userKeys } from '@/src/shared/config/queryKeys';
import type { IUserResponseData } from '@/src/shared/types';

export const userQueryOptions = (get: TGet = clientGet) =>
  queryOptions({
    queryKey: userKeys.all,
    queryFn: async () => jsonOrThrow<IUserResponseData>(await get('/api/user')),
  });

export const useGetUserData = () => useSuspenseQuery(userQueryOptions());
