import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { clientGet, jsonOrThrow, type TGet } from '@/src/shared/api/request';
import { reviewKeys } from '@/src/shared/config/queryKeys';
import type { IReviewResponseData } from '@/src/shared/types';

export const reviewDetailQueryOptions = (docId: string, get: TGet = clientGet) =>
  queryOptions({
    queryKey: reviewKeys.detail(docId),
    queryFn: async () => jsonOrThrow<IReviewResponseData>(await get(`/api/review/detail?docId=${docId}`)),
  });

export const useGetReviewDetailData = (docId: string) => useSuspenseQuery(reviewDetailQueryOptions(docId));
