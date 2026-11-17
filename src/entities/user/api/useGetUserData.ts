import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import type { IUserResponseData } from '@/src/entities/user/model/types';
import { clientGet, jsonOrThrow, type TGet } from '@/src/shared/api/request';
import { userKeys } from '@/src/shared/config/queryKeys';

export const userQueryOptions = (get: TGet = clientGet) =>
  queryOptions({
    queryKey: userKeys.all,
    queryFn: async () => jsonOrThrow<IUserResponseData>(await get('/api/user')),
  });

export const useGetUserData = () => useSuspenseQuery(userQueryOptions());
