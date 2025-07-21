import { useSuspenseQuery } from '@tanstack/react-query';

import type { IReviewResponseData } from '@/src/shared/types';

export const useSuspenseGetReviewDetailData = (docId: string) => {
  const res = useSuspenseQuery({
    queryKey: ['reviewEdit', docId],
    queryFn: async () => {
      const response = await fetch(`/api/review/detail?docId=${docId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch review detail');
      }
      return response.json() as Promise<IReviewResponseData>;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (res.data.response !== 'ok') {
    throw new Error(res.data.message || 'Failed to fetch review data');
  }

  return res;
};
