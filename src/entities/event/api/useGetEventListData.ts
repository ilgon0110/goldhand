import type { UseQueryOptions } from '@tanstack/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';

import { eventKeys } from '@/src/shared/config/queryKeys';
import type { IEventListResponseData } from '@/src/shared/types';

import { getEventListData } from './loader';

type TUseGetEventListDataQuery = Omit<UseQueryOptions<IEventListResponseData>, 'queryFn' | 'queryKey'>;

export const useGetEventListData = (params: { page: number; status: string }, options?: TUseGetEventListDataQuery) => {
  return useSuspenseQuery({
    queryKey: eventKeys.list(params),
    queryFn: () => getEventListData(params.page, params.status),
    ...options,
  });
};
