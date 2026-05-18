import { useQuery } from '@tanstack/react-query';

import { eventKeys } from '@/src/shared/config/queryKeys';
import type { IReviewResponseData } from '@/src/shared/types';
import { fetcher } from '@/src/shared/utils/fetcher.client';

export const useGetEventData = (docId: string) => {
  const res = useQuery({
    queryKey: eventKeys.detail(docId),
    queryFn: async () => {
      const response = await fetcher(`/api/event/detail?docId=${docId}`);

      return response as Promise<IReviewResponseData>;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return res;
};
