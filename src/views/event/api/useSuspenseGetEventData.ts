import { useSuspenseQuery } from '@tanstack/react-query';

import type { IReviewResponseData } from '@/src/shared/types';
import { fetcher } from '@/src/shared/utils/fetcher.client';

export const useSuspenseGetEventData = (docId: string) => {
  const res = useSuspenseQuery({
    queryKey: ['eventEdit', docId],
    queryFn: async () => {
      const response = await fetcher(`/api/event/detail?docId=${docId}`);

      return response as Promise<IReviewResponseData>;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  if (res.data.response !== 'ok') {
    throw new Error(res.data.message || 'Failed to fetch event data');
  }

  return res;
};
