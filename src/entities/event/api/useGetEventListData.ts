import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { clientGet, jsonOrThrow, type TGet } from '@/src/shared/api/request';
import { eventKeys } from '@/src/shared/config/queryKeys';
import type { IEventListResponseData } from '@/src/shared/types';

type TEventListParams = { page: number; status: string };

export const eventListQueryOptions = (params: TEventListParams, get: TGet = clientGet) =>
  queryOptions({
    queryKey: eventKeys.list(params),
    queryFn: async () =>
      jsonOrThrow<IEventListResponseData>(await get(`/api/event?page=${params.page}&status=${params.status}`)),
  });

export const useGetEventListData = (params: TEventListParams) => useSuspenseQuery(eventListQueryOptions(params));
