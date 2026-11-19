import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { clientGet, type TGet } from '@/src/shared/api/request';
import { reservationKeys } from '@/src/shared/config/queryKeys';

import type { IReservationDetailData } from '../model/types';

type TReservationListParams = { page: number; hideSecret: string };

interface IReservationListResponseData {
  message: string;
  consultData: (IReservationDetailData & { id: string })[];
  pageableDataLength: number;
  totalDataLength: number;
}

export const reservationListQueryOptions = (params: TReservationListParams, get: TGet = clientGet) =>
  queryOptions({
    queryKey: reservationKeys.list(params),
    // 기존 동작 유지: 500이어도 빈 목록 body를 그대로 쓴다.
    queryFn: async (): Promise<IReservationListResponseData> =>
      (await get(`/api/reservation?page=${params.page}&hideSecret=${params.hideSecret}`)).json(),
  });

export const useGetReservationListData = (params: TReservationListParams) =>
  useSuspenseQuery(reservationListQueryOptions(params));
