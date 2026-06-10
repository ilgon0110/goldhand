import type { UseQueryOptions } from '@tanstack/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getViewCountData } from '@/src/shared/api/getViewCountData';
import { viewCountKeys } from '@/src/shared/config/queryKeys';
import type { IViewCountResponseData } from '@/src/shared/types';

type TUseGetViewCountDataQuery = Omit<UseQueryOptions<IViewCountResponseData>, 'queryFn' | 'queryKey'>;

export const useGetViewCountData = (docId: string, options?: TUseGetViewCountDataQuery) => {
  return useSuspenseQuery({
    queryKey: viewCountKeys.detail(docId),
    queryFn: () => getViewCountData({ docId }),
    ...options,
  });
};
