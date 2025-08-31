import { renderHook } from '@testing-library/react';

import { useAuthState } from '@/src/shared/hooks/useAuthState';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
}));

vi.mock('@/src/shared/config/firebase', () => ({
  firebaseApp: {
    auth: vi.fn(),
  },
}));

const mockFetch = (response: any, ok = true) => {
  return vi.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(response),
    } as Response),
  );
};

const navigate = vi.fn();
vi.mock('next/navigation', () => ({
  usePathname: () => navigate(),
}));

describe('useAuthState 테스트', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('초기 상태는 pending 상태로 설정', () => {
    const { result } = renderHook(() => useAuthState());

    expect(result.current.pending).toBe(true);
    expect(result.current.isSignedIn).toBe(false);
    expect(result.current.userData).toBeNull();
    expect(result.current.isLinked).toBe(false);
  });

  it('사용자 데이터가 성공적으로 가져와지면 authState 업데이트', async () => {
    const mockUserData = {
      isSignedIn: true,
      pending: false,
      userData: {
        uid: '12345',
        email: 'example@naver.com',
      },
      isLinked: true,
    };
    global.fetch = mockFetch(mockUserData);

    const { result } = renderHook(() => useAuthState());
    console.log(result.current);
    // 초기 상태 확인
    expect(result.current.userData).toBeNull();

    // 사용자가 페이지를 이동해서 pathname이 변경됨

    // 사용자 데이터 가져오기
    // await waitForNextUpdate();

    // 상태 업데이트 확인
    // expect(result.current.userData).toEqual(mockUserData);
  });
});
