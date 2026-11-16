import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { clientGet, type TGet } from '@/src/shared/api/request';
import { reservationKeys } from '@/src/shared/config/queryKeys';
import type { IReservationResponseData } from '@/src/shared/types';

export const reservationDetailQueryOptions = (docId: string, get: TGet = clientGet) =>
  queryOptions({
    queryKey: reservationKeys.detail(docId),
    // 403(NEEDS_PASSWORD/NEEDS_LOGIN/ACCESS_DENIED) 등도 code가 담긴 body로 화면을 분기하므로 throw하지 않는다.
    queryFn: async (): Promise<IReservationResponseData> =>
      (await get(`/api/reservation/detail?docId=${docId}`)).json(),
  });

export const useGetReservationDetailData = (docId: string) => useSuspenseQuery(reservationDetailQueryOptions(docId));
