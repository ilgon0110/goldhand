import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import LoginPage from '@/app/login/page';
import { RejoinModal } from '@/app/login/ui/RejoinModal';
import { server } from '@/src/__mock__/node';
import { mockUserData } from '@/src/__mock__/user';
import * as utils from '@/src/shared/utils';
import { renderWithQueryClient } from '@/src/shared/utils/test/render';

const pushMock = vi.fn();
const replaceMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
  usePathname: () => '/login',
  useSearchParams: () => new URLSearchParams(''),
  useParams: () => ({ shopId: 'shopId' }),
}));

vi.mock('@/src/shared/hooks/useMediaQuery', () => ({
  useMediaQuery: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/src/shared/utils', async () => {
  // 원본 모듈 import
  const actual = await vi.importActual('@/src/shared/utils');
  return {
    ...actual,
    toastSuccess: vi.fn(),
    toastError: vi.fn(),
  };
});

vi.mock('@/app/login/api/naverLoginTokenAction', () => ({
  naverLoginTokenAction: vi.fn(async (_code: string) => ({
    access_token: 'naverAccessToken',
    error_description: undefined,
  })),
}));

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.resetModules();
});

describe('Login Component', () => {
  it('렌더링 테스트. 카카오, 네이버 로그인 버튼이 렌더링된다', async () => {
    renderWithQueryClient(<LoginPage />);

    expect(screen.getByText('카카오로 로그인하기')).toBeInTheDocument();
    expect(screen.getByText('네이버로 로그인하기')).toBeInTheDocument();
  });

  it('[카카오] 카카오 로그인 버튼이 렌더링되고 활성화 상태이다', async () => {
    renderWithQueryClient(<LoginPage />);

    const kakaoButton = screen.getByRole('button', { name: /카카오로 로그인하기/ });
    expect(kakaoButton).toBeEnabled();
  });

  it('[네이버] 로그인 버튼을 클릭하면 네이버 로그인 페이지로 이동한다', async () => {
    renderWithQueryClient(<LoginPage />);

    const naverButton = screen.getByRole('button', { name: /네이버로 로그인하기/ });
    await userEvent.click(naverButton);

    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining(`https://nid.naver.com/oauth2.0/authorize`));
  });

  it('[카카오] 로그인 실패 시 에러 메시지가 표시된다', async () => {
    vi.doMock('next/navigation', () => ({
      useRouter: () => ({ push: pushMock, replace: replaceMock }),
      usePathname: () => '/login',
      useSearchParams: () => new URLSearchParams('kakao_error=로그인 실패 이유'),
      useParams: () => ({ shopId: 'shopId' }),
    }));

    const LoginPage = (await import('@/app/login/page')).default;
    renderWithQueryClient(<LoginPage />);

    expect(utils.toastError).toHaveBeenCalledWith('로그인 실패 이유');
  });

  it('[네이버] 로그인 실패 시 에러 메시지가 표시된다', async () => {
    vi.doMock('next/navigation', () => ({
      useRouter: () => ({ push: pushMock, replace: replaceMock }),
      usePathname: () => '/login',
      useSearchParams: () => new URLSearchParams('naver_error=로그인 실패 이유'),
      useParams: () => ({ shopId: 'shopId' }),
    }));

    const LoginPage = (await import('@/app/login/page')).default;
    renderWithQueryClient(<LoginPage />);

    expect(utils.toastError).toHaveBeenCalledWith('로그인 실패 이유');
  });

  it('[공통] 로그인을 시도한 유저가 탈퇴한 지 3년 이내 유저라면, 재가입 모달이 표시된다', async () => {
    vi.doMock('next/navigation', () => ({
      useRouter: () => ({ push: pushMock, replace: replaceMock }),
      usePathname: () => '/login',
      useSearchParams: () => new URLSearchParams('rejoin=true'),
      useParams: () => ({ shopId: 'shopId' }),
    }));

    server.use(
      http.get('/api/user/rejoin', async () => {
        return HttpResponse.json({
          response: 'ok',
          message: '탈퇴 유저 정보 확인',
          userData: mockUserData.userData,
        });
      }),
    );

    const LoginPage = (await import('@/app/login/page')).default;
    renderWithQueryClient(<LoginPage />);

    expect(await screen.findByText('고운황금손에 재가입하시겠습니까?')).toBeInTheDocument();
  });

  it('[공통] 재가입 모달에서 재가입을 시도하면 재가입 API가 호출된다', async () => {
    // 1. 필요한 상태와 setter mock 준비
    const handler = vi.fn();
    server.use(http.post('/api/user/rejoin', handler));
    const setIsRejoinDialogOpen = vi.fn();
    const setRejoinUserData = vi.fn();

    // 2. 모달 렌더링
    renderWithQueryClient(
      <RejoinModal
        isRejoinDialogOpen={true}
        rejoinUserData={mockUserData.userData!}
        setIsRejoinDialogOpen={setIsRejoinDialogOpen}
        setRejoinUserData={setRejoinUserData}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: '재가입' }));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('[공통] 재가입 모달에서 취소를 누르면 모달이 닫힌다', async () => {
    const setIsRejoinDialogOpen = vi.fn();
    const setRejoinUserData = vi.fn();

    // 2. 모달 렌더링
    renderWithQueryClient(
      <RejoinModal
        isRejoinDialogOpen={true}
        rejoinUserData={mockUserData.userData!}
        setIsRejoinDialogOpen={setIsRejoinDialogOpen}
        setRejoinUserData={setRejoinUserData}
      />,
    );

    // 3. 텍스트, 버튼 등 검증
    expect(screen.getByText('고운황금손에 재가입하시겠습니까?')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '닫기' }));

    expect(setIsRejoinDialogOpen).toHaveBeenCalledWith(false);
  });

  it('[공통] 재가입이 성공하면 재가입 성공 메시지 토스트 알림이 노출된다.', async () => {
    // 1. 필요한 상태와 setter mock 준비
    const handler = vi.fn();
    server.use(http.post('/api/user/rejoin', handler));
    const setIsRejoinDialogOpen = vi.fn();
    const setRejoinUserData = vi.fn();

    // 2. 모달 렌더링
    renderWithQueryClient(
      <RejoinModal
        isRejoinDialogOpen={true}
        rejoinUserData={mockUserData.userData!}
        setIsRejoinDialogOpen={setIsRejoinDialogOpen}
        setRejoinUserData={setRejoinUserData}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: '재가입' }));

    await waitFor(() => {
      expect(utils.toastSuccess).toHaveBeenCalledWith('재가입이 완료되었습니다.');
    });
  });

  it('[공통] 재가입이 실패하면 재가입 실패 메시지 토스트 알림이 노출된다.', async () => {
    // 1. 필요한 상태와 setter mock 준비
    const handler = vi.fn(async () => {
      return HttpResponse.json({
        response: 'ng',
        message: '재가입에 실패하였습니다.',
      });
    });
    server.use(http.post('/api/user/rejoin', handler));
    const setIsRejoinDialogOpen = vi.fn();
    const setRejoinUserData = vi.fn();

    // 2. 모달 렌더링
    renderWithQueryClient(
      <RejoinModal
        isRejoinDialogOpen={true}
        rejoinUserData={mockUserData.userData!}
        setIsRejoinDialogOpen={setIsRejoinDialogOpen}
        setRejoinUserData={setRejoinUserData}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: '재가입' }));

    await waitFor(() => {
      expect(utils.toastError).toHaveBeenCalledWith('재가입에 실패하였습니다.');
    });
  });
});
