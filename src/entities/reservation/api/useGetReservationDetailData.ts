import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import type { IReservationResponseData } from '@/src/entities/reservation/model/types';
import { clientGet, jsonOrThrow, type TGet } from '@/src/shared/api/request';
import { reservationKeys } from '@/src/shared/config/queryKeys';

export const reservationDetailQueryOptions = (docId: string, get: TGet = clientGet) =>
  queryOptions({
    queryKey: reservationKeys.detail(docId),
    // 400·401(TOKEN_EXPIRED)·403(NEEDS_PASSWORD/NEEDS_LOGIN/ACCESS_DENIED)·404는 code가 담긴 body로 화면을 분기하므로 throw하지 않는다. 5xx만 throw.
    queryFn: async () =>
      jsonOrThrow<IReservationResponseData>(await get(`/api/reservation/detail?docId=${docId}`), [400, 401, 403, 404]),
  });

export const useGetReservationDetailData = (docId: string) => useSuspenseQuery(reservationDetailQueryOptions(docId));
