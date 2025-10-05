import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import { server } from '@/src/__mock__/node';
import { mockUserData } from '@/src/__mock__/user';
import { useAuth } from '@/src/shared/hooks/useAuth';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
}));

vi.mock('@/src/shared/config/firebase', () => ({
  firebaseApp: {
    auth: vi.fn(),
  },
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/test-path',
  useSearchParams: () => new URLSearchParams('param1=value1&param2=value2'),
}));

beforeAll(() => server.listen()); // Enable API mocking before all tests
afterEach(() => server.resetHandlers()); // Reset any request overrides between tests
afterAll(() => server.close()); // Clean up after all tests

describe('useAuth 테스트', () => {
  it('초기 상태는 pending, isSignedIn=false, userData=null, isLinked=false', () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.pending).toBe(true);
    expect(result.current.isSignedIn).toBe(false);
    expect(result.current.userData).toBeNull();
    expect(result.current.isLinked).toBe(false);
  });

  it('사용자 데이터가 성공적으로 가져와지면 authState가 업데이트된다', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    server.use(
      http.get(`/api/user`, async () =>
        HttpResponse.json({
          response: 'ok',
          message: '성공',
          userData: mockUserData.userData,
          isLinked: true,
        }),
      ),
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    // page 이동
    await waitFor(() => {
      expect(result.current.pending).toBe(false);
      expect(result.current.isSignedIn).toBe(true);
      expect(result.current.userData).toEqual(mockUserData.userData);
      expect(result.current.isLinked).toBe(true);
    });
  });

  it('API 응답이 ng이면 로그인 상태가 false로 설정된다', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    server.use(
      http.get(`/api/user`, async () =>
        HttpResponse.json({ response: 'ng', message: '실패', userData: null, isLinked: false }),
      ),
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.pending).toBe(false);
      expect(result.current.isSignedIn).toBe(false);
      expect(result.current.userData).toBeNull();
      expect(result.current.isLinked).toBe(false);
    });
  });
});
