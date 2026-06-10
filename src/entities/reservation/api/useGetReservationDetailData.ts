import type { UseQueryOptions } from '@tanstack/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';

import { reservationKeys } from '@/src/shared/config/queryKeys';
import type { IReservationResponseData } from '@/src/shared/types';

import { getReservationDetailData } from './getReservationDetailData';

type TUseGetReservationDetailDataQuery = Omit<UseQueryOptions<IReservationResponseData>, 'queryFn' | 'queryKey'>;

export const useGetReservationDetailData = (docId: string, options?: TUseGetReservationDetailDataQuery) => {
  return useSuspenseQuery({
    queryKey: reservationKeys.detail(docId),
    queryFn: () => getReservationDetailData({ docId }),
    ...options,
  });
};
