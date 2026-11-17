import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { server } from '@/src/__mock__/node';
import { mockUserData } from '@/src/__mock__/user';
import { useHeaderUserQuery, useUserQuery } from '@/src/entities/user/api/useUserQuery';
import { userKeys } from '@/src/shared/config/queryKeys';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function setup(queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, ...renderHook(() => useUserQuery(), { wrapper }) };
}

const userResponse = (name: string) => ({
  response: 'ok',
  message: '성공',
  userData: { ...mockUserData.userData, name },
  isLinked: true,
});

describe('useUserQuery', () => {
  it('suspend하지 않고 pending으로 시작한 뒤 /api/user 응답을 반환한다', async () => {
    server.use(http.get('/api/user', () => HttpResponse.json(userResponse('홍길동'))));
    const { result } = setup();

    expect(result.current.isPending).toBe(true);
    await waitFor(() => expect(result.current.data?.userData?.name).toBe('홍길동'));
  });

  it('비로그인 응답이면 userData가 null이다', async () => {
    server.use(
      http.get('/api/user', () => HttpResponse.json({ response: 'ng', message: '실패', userData: null, isLinked: false })),
    );
    const { result } = setup();

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data?.userData).toBeNull();
  });

  // #111: 헤더(useUserQuery)와 page(useUserSuspenseQuery)가 같은 key를 써야 hydrate 캐시를 공유하고,
  // 마이페이지 수정 후 userKeys.all invalidate가 헤더까지 갱신한다.
  it('userKeys.all에 hydrate된 데이터를 요청 없이 쓰고, invalidate 시 새 값으로 갱신된다', async () => {
    let requestCount = 0;
    server.use(
      http.get('/api/user', () => {
        requestCount += 1;
        return HttpResponse.json(userResponse('수정된 이름'));
      }),
    );
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 20 * 1000 } } });
    queryClient.setQueryData(userKeys.all, userResponse('이전 이름'));

    const { result } = setup(queryClient);
    expect(result.current.data?.userData?.name).toBe('이전 이름');
    expect(requestCount).toBe(0);

    await act(() => queryClient.invalidateQueries({ queryKey: userKeys.all }));
    await waitFor(() => expect(result.current.data?.userData?.name).toBe('수정된 이름'));
  });

  // #111 A-1: 헤더는 하위 key(['user','header'])를 쓰므로, 마이페이지 수정 후 userKeys.all invalidate에 prefix로 함께 갱신돼야 한다.
  it('헤더 쿼리도 userKeys.all invalidate로 새 값으로 갱신된다', async () => {
    server.use(http.get('/api/user', () => HttpResponse.json(userResponse('수정된 이름'))));
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: 20 * 1000 } } });
    queryClient.setQueryData([...userKeys.all, 'header'], userResponse('이전 이름'));
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useHeaderUserQuery(), { wrapper });
    expect(result.current.data?.userData?.name).toBe('이전 이름');

    await act(() => queryClient.invalidateQueries({ queryKey: userKeys.all }));
    await waitFor(() => expect(result.current.data?.userData?.name).toBe('수정된 이름'));
  });
});
