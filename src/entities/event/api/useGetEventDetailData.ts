import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { clientGet, jsonOrThrow, type TGet } from '@/src/shared/api/request';
import { eventKeys } from '@/src/shared/config/queryKeys';

import type { IEventResponseData } from '../model/types';

export const eventDetailQueryOptions = (docId: string, get: TGet = clientGet) =>
  queryOptions({
    queryKey: eventKeys.detail(docId),
    queryFn: async () => jsonOrThrow<IEventResponseData>(await get(`/api/event/detail?docId=${docId}`)),
  });

export const useGetEventDetailData = (docId: string) => useSuspenseQuery(eventDetailQueryOptions(docId));
