import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import type { IUserListResponseData } from '@/src/entities/user/model/types';
import { clientGet, type TGet } from '@/src/shared/api/request';
import { userListKeys } from '@/src/shared/config/queryKeys';

export const userListQueryOptions = (params: { page: number }, get: TGet = clientGet) =>
  queryOptions({
    queryKey: userListKeys.list(params),
    queryFn: async (): Promise<IUserListResponseData> => (await get(`/api/user/list?page=${params.page}`)).json(),
  });

export const useGetUserListData = (params: { page: number }) => useSuspenseQuery(userListQueryOptions(params));
