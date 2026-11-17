import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import type { IViewCountResponseData } from '@/src/entities/viewCount/model/types';
import { clientGet, type TGet } from '@/src/shared/api/request';
import { viewCountKeys } from '@/src/shared/config/queryKeys';

export const viewCountQueryOptions = (docId: string, get: TGet = clientGet) =>
  queryOptions({
    queryKey: viewCountKeys.detail(docId),
    // 조회 기록이 없는 글은 404 + { data: null }이 정상 응답이라 throw하지 않는다.
    queryFn: async (): Promise<IViewCountResponseData> => (await get(`/api/viewCount?docId=${docId}`)).json(),
  });

export const useGetViewCountData = (docId: string) => useSuspenseQuery(viewCountQueryOptions(docId));
