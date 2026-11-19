import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { server } from '@/src/__mock__/node';
import { useUserSuspenseQuery } from '@/src/entities/user/api/useUserQuery';
import type { IUserResponseData } from '@/src/entities/user/model/types';

describe('useUserSuspenseQuery', () => {
  it('loads the current user from the client /api/user endpoint', async () => {
    const response: IUserResponseData = {
      response: 'ok',
      message: '사용자 정보 조회 성공',
      userData: null,
      isLinked: false,
    };
    let requestedPath = '';

    server.use(
      http.get('/api/user', ({ request }) => {
        requestedPath = new URL(request.url).pathname;
        return HttpResponse.json(response);
      }),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUserSuspenseQuery(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual(response);
    });

    expect(requestedPath).toBe('/api/user');
  });
});
