import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import type { IEventListResponseData } from '@/src/entities/event/model/types';
import { clientGet, jsonOrThrow, type TGet } from '@/src/shared/api/request';
import { eventKeys } from '@/src/shared/config/queryKeys';

type TEventListParams = { page: number; status: string };

export const eventListQueryOptions = (params: TEventListParams, get: TGet = clientGet) =>
  queryOptions({
    queryKey: eventKeys.list(params),
    queryFn: async () =>
      jsonOrThrow<IEventListResponseData>(await get(`/api/event?page=${params.page}&status=${params.status}`)),
  });

export const useGetEventListData = (params: TEventListParams) => useSuspenseQuery(eventListQueryOptions(params));
