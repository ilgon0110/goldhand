import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { server } from '@/src/__mock__/node';
import { usePinMutation } from '@/src/entities/pin/api/usePinMutation';
import { reviewKeys } from '@/src/shared/config/queryKeys';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('usePinMutation', () => {
  it('caller-supplied onSuccess를 넘겨도 캐시 invalidate와 콜백이 모두 실행된다', async () => {
    server.use(
      http.post('/api/review/pin', async () => HttpResponse.json({ response: 'ok', message: '성공' })),
    );

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const callerOnSuccess = vi.fn();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePinMutation('review', { onSuccess: callerOnSuccess }), {
      wrapper,
    });

    result.current.mutate({ docId: 'doc-1', isPinned: true });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // 내부 invalidate 로직이 caller의 onSuccess로 완전히 대체되지 않고 함께 실행되어야 한다
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: reviewKeys.all });
    expect(callerOnSuccess).toHaveBeenCalledTimes(1);
  });
});
