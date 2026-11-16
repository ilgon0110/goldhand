import { useInfiniteQuery } from '@tanstack/react-query';

import { clientGet, jsonOrThrow } from '../api/request';
import { notificationKeys } from '../config/queryKeys';
import type { INotificationResponseData } from '../types';

export const useInfiniteAlarmQuery = (userId: string) => {
  return useInfiniteQuery({
    queryKey: notificationKeys.list(userId),
    queryFn: async ({ pageParam }) =>
      jsonOrThrow<INotificationResponseData>(await clientGet(`/api/notification?page=${pageParam}`)),
    initialPageParam: 1 as number | string,
    getNextPageParam: lastPage => lastPage.nextCursor,
    enabled: !!userId,
    refetchInterval: 1000 * 30, // 30초마다 새로고침
  });
};
