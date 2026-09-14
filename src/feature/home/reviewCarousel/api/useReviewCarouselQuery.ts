import { useSuspenseQuery } from '@tanstack/react-query';

import { getReviewListData } from '@/src/entities/review';
import { reviewKeys } from '@/src/shared/config/queryKeys';

export const useReviewCarouselQuery = () => {
  return useSuspenseQuery({
    queryKey: reviewKeys.carousel(),
    queryFn: () => getReviewListData(1, '전체'),
    select: data => data.reviewData,
  });
};
