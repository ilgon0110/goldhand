import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query';

// 서버 page와 클라이언트 QueryProvider가 공유하는 설정. 서버 page에서도 호출하므로 'use client'를 붙이지 않는다.
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      // hydration시 staleTime이 0이면 서버에서 가져온 데이터가 바로 stale이 되어버림 -> 20초로 설정
      queries: { staleTime: 20 * 1000 },
      dehydrate: {
        // await하지 않은 prefetch(pending)도 promise째 내려보내 클라이언트가 스트리밍으로 받는다.
        shouldDehydrateQuery: query => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
        // 기본값은 서버 에러를 'redacted'로 바꾼다. production에서는 Next가 메시지를 digest로 가리므로 원본을 넘긴다.
        shouldRedactErrors: () => false,
      },
    },
  });
}
