import type { UseQueryOptions } from '@tanstack/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';

import { eventKeys } from '@/src/shared/config/queryKeys';
import type { IEventResponseData } from '@/src/shared/types';

import { getEventDetailData } from './loader';

type TUseGetEventDetailDataQuery = Omit<UseQueryOptions<IEventResponseData>, 'queryFn' | 'queryKey'>;

export const useGetEventDetailData = (docId: string, options?: TUseGetEventDetailDataQuery) => {
  return useSuspenseQuery({
    queryKey: eventKeys.detail(docId),
    queryFn: () => getEventDetailData({ docId }),
    ...options,
  });
};
