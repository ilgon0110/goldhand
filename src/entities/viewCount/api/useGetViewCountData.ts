import { queryOptions, useQuery } from '@tanstack/react-query';

import { clientGet, type TGet } from '@/src/shared/api/request';
import { viewCountKeys } from '@/src/shared/config/queryKeys';

import type { IViewCountResponseData } from '../model/types';

export const viewCountQueryOptions = (docId: string, get: TGet = clientGet) =>
  queryOptions({
    queryKey: viewCountKeys.detail(docId),
    // 조회수는 부가 정보라 throw하면 상세 페이지 전체가 error.tsx로 바뀐다.
    // 404(조회 기록 없음)·5xx·nginx 502 HTML 모두 data: null로 두고 조회수만 비운다.
    queryFn: async (): Promise<IViewCountResponseData> => {
      const res = await get(`/api/viewCount?docId=${docId}`);
      return res.ok ? res.json() : { response: 'ng', message: `viewCount ${res.status}`, data: null };
    },
  });

// 부가 정보라 useQuery로 본문 렌더를 막지 않는다. 상세 page가 prefetch하므로 SSR에도 값이 있다.
export const useGetViewCountData = (docId: string) => useQuery(viewCountQueryOptions(docId));
