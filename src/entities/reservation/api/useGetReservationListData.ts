import type { UseQueryOptions } from '@tanstack/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';

import { reservationKeys } from '@/src/shared/config/queryKeys';

import { getReservationListData } from './getReservationListData';

type TReservationListData = Awaited<ReturnType<typeof getReservationListData>>;
type TUseGetReservationListDataQuery = Omit<UseQueryOptions<TReservationListData>, 'queryFn' | 'queryKey'>;

export const useGetReservationListData = (
  params: { page: number; hideSecret: string },
  options?: TUseGetReservationListDataQuery,
) => {
  return useSuspenseQuery({
    queryKey: reservationKeys.list(params),
    queryFn: () => getReservationListData(params),
    ...options,
  });
};
