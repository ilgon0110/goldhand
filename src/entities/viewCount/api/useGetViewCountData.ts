import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import type { IViewCountResponseData } from '@/src/entities/viewCount/model/types';
import { clientGet, type TGet } from '@/src/shared/api/request';
import { viewCountKeys } from '@/src/shared/config/queryKeys';

export const viewCountQueryOptions = (docId: string, get: TGet = clientGet) =>
  queryOptions({
    queryKey: viewCountKeys.detail(docId),
    // 조회수는 부가 정보라 throw하면 useSuspenseQuery가 상세 페이지 전체를 error.tsx로 바꾼다.
    // 404(조회 기록 없음)·5xx·nginx 502 HTML 모두 data: null로 두고 조회수만 비운다.
    queryFn: async (): Promise<IViewCountResponseData> => {
      const res = await get(`/api/viewCount?docId=${docId}`);
      return res.ok ? res.json() : { response: 'ng', message: `viewCount ${res.status}`, data: null };
    },
  });

export const useGetViewCountData = (docId: string) => useSuspenseQuery(viewCountQueryOptions(docId));
