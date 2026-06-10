import type { UseQueryOptions } from '@tanstack/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';

import { reviewKeys } from '@/src/shared/config/queryKeys';
import type { IReviewResponseData } from '@/src/shared/types';

import { getReviewDetailData } from './getReviewDetailData';

type TUseGetReviewDetailDataQuery = Omit<UseQueryOptions<IReviewResponseData>, 'queryFn' | 'queryKey'>;

export const useGetReviewDetailData = (docId: string, options?: TUseGetReviewDetailDataQuery) => {
  return useSuspenseQuery({
    queryKey: reviewKeys.detail(docId),
    queryFn: () => getReviewDetailData({ docId }),
    ...options,
  });
};
