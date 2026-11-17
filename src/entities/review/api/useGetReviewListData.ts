import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import type { IReviewListResponseData } from '@/src/entities/review/model/types';
import { clientGet, jsonOrThrow, type TGet } from '@/src/shared/api/request';
import { reviewKeys } from '@/src/shared/config/queryKeys';

type TReviewListParams = { page: number; franchisee: string };

export const reviewListQueryOptions = (params: TReviewListParams, get: TGet = clientGet) =>
  queryOptions({
    queryKey: reviewKeys.list(params),
    queryFn: async () =>
      jsonOrThrow<IReviewListResponseData>(await get(`/api/review?page=${params.page}&franchisee=${params.franchisee}`)),
  });

export const useGetReviewListData = (params: TReviewListParams) => useSuspenseQuery(reviewListQueryOptions(params));
