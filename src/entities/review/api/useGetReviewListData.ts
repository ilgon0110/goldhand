import type { UseQueryOptions } from '@tanstack/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';

import type { TFranchiseeList } from '@/src/shared/config';
import { reviewKeys } from '@/src/shared/config/queryKeys';
import type { IReviewListResponseData } from '@/src/shared/types';

import { getReviewListData } from './getReviewListData';

type TUseGetReviewListDataQuery = Omit<UseQueryOptions<IReviewListResponseData>, 'queryFn' | 'queryKey'>;

export const useGetReviewListData = (
  params: { page: number; franchisee: string },
  options?: TUseGetReviewListDataQuery,
) => {
  return useSuspenseQuery({
    queryKey: reviewKeys.list(params),
    queryFn: () => getReviewListData(params.page, params.franchisee as TFranchiseeList),
    ...options,
  });
};
