import { useInfiniteQuery } from '@tanstack/react-query';

import { notificationKeys } from '../config/queryKeys';
import type { INotificationResponseData } from '../types';
import { authFetcher } from '../utils/fetcher.server';

export const useInfiniteAlarmQuery = (userId: string) => {
  return useInfiniteQuery<INotificationResponseData>({
    queryKey: notificationKeys.list(userId),
    queryFn: async ({ pageParam = 1 }) => {
      return await authFetcher(`/api/notification?page=${pageParam}`, {
        credentials: 'include',
      });
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => lastPage.nextCursor,
    enabled: !!userId,
  });
};
