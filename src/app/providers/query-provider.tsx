'use client'; // QueryClientProvider가 useContext를 쓰므로 필수

import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      // hydration시 staleTime이 0이면 서버에서 가져온 데이터가 바로 stale이 되어버림 -> 20초로 설정
      queries: { staleTime: 20 * 1000 },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient(); // 서버: 요청마다 새로 생성 (데이터 격리)
  } else {
    // 브라우저: 한 번만 생성해서 재사용
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState 대신 getQueryClient() 직접 호출
  const queryClient = getQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
