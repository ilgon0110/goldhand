import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { clientGet, type TGet } from '@/src/shared/api/request';
import { viewCountKeys } from '@/src/shared/config/queryKeys';

import type { IViewCountResponseData } from '../model/types';

export const viewCountQueryOptions = (docId: string, get: TGet = clientGet) =>
  queryOptions({
    queryKey: viewCountKeys.detail(docId),
    // 조회수는 부가 정보라 절대 throw하지 않는다. 스트리밍으로 내려가는 쿼리라 throw하면 Error Boundary가 필요해진다.
    // 404(조회 기록 없음)·5xx·nginx 502 HTML·네트워크 에러 모두 data: null로 두고 조회수만 비운다.
    queryFn: async (): Promise<IViewCountResponseData> => {
      try {
        const res = await get(`/api/viewCount?docId=${docId}`);
        if (res.ok) return await res.json();
        return { response: 'ng', message: `viewCount ${res.status}`, data: null };
      } catch (error) {
        return { response: 'ng', message: String(error), data: null };
      }
    },
  });

// 상세 page가 await 없이 prefetch(pending dehydrate)하고, ViewCount가 <Suspense> 안에서 스트리밍으로 받는다.
export const useGetViewCountData = (docId: string) => useSuspenseQuery(viewCountQueryOptions(docId));
