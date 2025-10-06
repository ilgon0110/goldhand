import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { server } from '@/src/__mock__/node';
import { mockUserData } from '@/src/__mock__/user';
import { apiUrl } from '@/src/shared/config';
import * as utils from '@/src/shared/utils';
import { renderWithQueryClient } from '@/src/shared/utils/test/render';
import { LoginPage } from '@/src/views/login';
import { RejoinModal } from '@/src/views/login/ui/RejoinModal';

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

vi.mock('@/src/views/login/api/naverLoginTokenAction', () => ({
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

  it('[카카오] 로그인 버튼을 클릭하면 카카오 로그인 페이지로 이동한다', async () => {
    renderWithQueryClient(<LoginPage />);

    const kakaoButton = screen.getByRole('button', { name: /카카오로 로그인하기/ });
    await userEvent.click(kakaoButton);

    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining('https://kauth.kakao.com/oauth/authorize'));
  });

  it('[네이버] 로그인 버튼을 클릭하면 네이버 로그인 페이지로 이동한다', async () => {
    renderWithQueryClient(<LoginPage />);

    const naverButton = screen.getByRole('button', { name: /네이버로 로그인하기/ });
    await userEvent.click(naverButton);

    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining(`https://nid.naver.com/oauth2.0/authorize`));
  });

  it('[카카오] 로그인 실패 시 에러 메시지가 표시된다', async () => {
    // 1. 해당 테스트에서만 useSearchParams 모킹
    // oAuth로그인 처리가 다 끝난 후 Redirect URL로 리다이렉트된 상황 가정
    vi.doMock('next/navigation', () => ({
      useRouter: () => ({
        push: pushMock,
      }),
      usePathname: () => '/login',
      useSearchParams: () => new URLSearchParams('error=access_denied&error_description=로그인 실패 이유'),
      useParams: () => ({ shopId: 'shopId' }),
    }));

    // 2. 모킹된 모듈로 LoginPage를 다시 import
    const { LoginPage } = await import('@/src/views/login');

    renderWithQueryClient(<LoginPage />);

    //await userEvent.click(kakaoButton);
    expect(utils.toastError).toHaveBeenCalledWith('로그인 실패 이유');
  });

  it('[네이버] 로그인 실패 시 에러 메시지가 표시된다', async () => {
    // 1. 해당 테스트에서만 useSearchParams 모킹
    // oAuth로그인 처리가 다 끝난 후 Redirect URL로 리다이렉트된 상황 가정
    vi.doMock('next/navigation', () => ({
      useRouter: () => ({
        push: pushMock,
      }),
      usePathname: () => '/login',
      // 네이버나 카카오나 오류 파라미터는 동일함
      useSearchParams: () => new URLSearchParams('error=access_denied&error_description=로그인 실패 이유'),
      useParams: () => ({ shopId: 'shopId' }),
    }));

    // 2. 모킹된 모듈로 LoginPage를 다시 import
    const { LoginPage } = await import('@/src/views/login');

    renderWithQueryClient(<LoginPage />);

    //await userEvent.click(kakaoButton);
    expect(utils.toastError).toHaveBeenCalledWith('로그인 실패 이유');
  });

  it('[카카오] 로그인 성공 시 메인 페이지로 리다이렉트된다.', async () => {
    // 1. 해당 테스트에서만 useSearchParams 모킹
    // oAuth로그인 처리가 다 끝난 후 Redirect URL로 리다이렉트된 상황 가정
    const routerMock = vi.fn();
    vi.doMock('next/navigation', () => ({
      useRouter: () => ({
        push: pushMock,
        replace: routerMock,
      }),
      usePathname: () => '/login',
      useSearchParams: () => new URLSearchParams('code=abc123&state=kakao'),
      useParams: () => ({ shopId: 'shopId' }),
    }));

    // 2. 모킹된 모듈로 LoginPage를 다시 import
    const { LoginPage } = await import('@/src/views/login');

    renderWithQueryClient(<LoginPage />);

    await waitFor(() => {
      expect(routerMock).toHaveBeenCalledWith('/');
    });
  });

  it('[네이버] 로그인 성공 시 메인 페이지로 리다이렉트된다.', async () => {
    // 1. 해당 테스트에서만 useSearchParams 모킹
    // oAuth로그인 처리가 다 끝난 후 Redirect URL로 리다이렉트된 상황 가정
    const routerMock = vi.fn();
    vi.doMock('next/navigation', () => ({
      useRouter: () => ({
        push: pushMock,
        replace: routerMock,
      }),
      usePathname: () => '/login',
      //state가 goldhand면 네이버 로그인
      useSearchParams: () => new URLSearchParams('code=abc123&state=goldhand'),
      useParams: () => ({ shopId: 'shopId' }),
    }));

    // 2. 모킹된 모듈로 LoginPage를 다시 import
    const { LoginPage } = await import('@/src/views/login');

    renderWithQueryClient(<LoginPage />);

    await waitFor(() => {
      expect(routerMock).toHaveBeenCalledWith('/');
    });
  });

  it('[공통] 로그인을 시도한 유저가 탈퇴한 지 3년 이내 유저라면, 재가입 모달이 표시된다', async () => {
    // 1. 해당 테스트에서만 useSearchParams 모킹
    // oAuth로그인 처리가 다 끝난 후 Redirect URL로 리다이렉트된 상황 가정
    const routerMock = vi.fn();
    vi.doMock('next/navigation', () => ({
      useRouter: () => ({
        push: pushMock,
        replace: routerMock,
      }),
      usePathname: () => '/login',
      useSearchParams: () => new URLSearchParams('code=abc123&state=goldhand'),
      useParams: () => ({ shopId: 'shopId' }),
    }));

    server.use(
      http.post(`${apiUrl}/api/auth/naver`, async () => {
        return HttpResponse.json(
          {
            response: 'rejoin',
            message: '재가입 가능한 유저입니다.',
            redirectTo: '/signup/rejoin',
            user: null,
            accessToken: null,
            email: 'mock@example.com',
            userData: mockUserData.userData,
          },
          { status: 200 },
        );
      }),
    );

    // 2. 모킹된 모듈로 LoginPage를 다시 import
    const { LoginPage } = await import('@/src/views/login');

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
