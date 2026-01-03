import { useQuery } from '@tanstack/react-query';

import { getReviewListData } from '@/src/entities/review';
import { reviewKeys } from '@/src/shared/config/queryKeys';

export const useReviewCarouselQuery = () => {
  return useQuery({
    queryKey: reviewKeys.carousel(),
    queryFn: () => getReviewListData(1, '전체'),
    select: data => data.reviewData,
  });
};
