import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { clientGet, jsonOrThrow, type TGet } from '@/src/shared/api/request';
import { reviewKeys } from '@/src/shared/config/queryKeys';
import type { IReviewListResponseData } from '@/src/shared/types';

export const reviewCarouselQueryOptions = (get: TGet = clientGet) =>
  queryOptions({
    queryKey: reviewKeys.carousel(),
    queryFn: async () => jsonOrThrow<IReviewListResponseData>(await get('/api/review?page=1&franchisee=전체')),
  });

export const useReviewCarouselQuery = () =>
  useSuspenseQuery({ ...reviewCarouselQueryOptions(), select: data => data.reviewData });
