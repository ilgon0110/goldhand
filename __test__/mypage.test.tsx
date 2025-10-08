import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { server } from '@/src/__mock__/node';
import { mockUserData } from '@/src/__mock__/user';
import type { IMyPageResponseData } from '@/src/shared/types';
import { renderWithQueryClient } from '@/src/shared/utils/test/render';
import { MyPagePage } from '@/src/views/mypage';
import { WithdrawalModal } from '@/src/widgets/MyPageWidget/ui/WithdrawalModal';

const pushMock = vi.fn();
const replaceMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
}));

vi.mock('firebase/auth', async () => {
  return {
    getAuth: vi.fn(),
  };
});

vi.mock('@/src/shared/config/firebase', () => ({
  firebaseApp: {
    auth: vi.fn(),
  },
}));

vi.mock('@/src/shared/hooks/useMediaQuery', () => ({
  useMediaQuery: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const logoutMock = vi.fn();
vi.mock('@/src/widgets/MyPageWidget/hooks/useLogoutMutation', () => ({
  useLogoutMutation: () => ({
    mutate: logoutMock,
  }),
}));

const withdrawMock = vi.fn();
vi.mock('@/src/widgets/MyPageWidget/hooks/useWithdrawalMutation', () => ({
  useWithdrawalMutation: () => ({
    mutate: withdrawMock,
  }),
}));

describe('Mypage 컴포넌트 테스트', () => {
  it('렌더링 테스트', async () => {
    const data: IMyPageResponseData = await (await fetch('/api/mypage')).json();
    renderWithQueryClient(<MyPagePage myPageData={data} />);

    expect(screen.getByText('고운황금손 마이페이지')).toBeInTheDocument();
    expect(screen.getByText('테스트 사용자')).toBeInTheDocument();
    expect(screen.getByText('testnick')).toBeInTheDocument();
    expect(screen.getByText('01012345678')).toBeInTheDocument();

    for (const consult of data?.data?.consults ?? []) {
      expect(screen.getByTestId(consult.id)).toBeInTheDocument();
    }

    for (const review of data?.data?.reviews ?? []) {
      expect(screen.getByTestId(review.id)).toBeInTheDocument();
    }

    for (const comment of data?.data?.comments ?? []) {
      expect(screen.getByTestId(comment.id)).toBeInTheDocument();
    }
  });

  it('작성한 후기 및 상담 내역이 없을 때 빈 상태 메시지가 올바르게 표시되는지 테스트', async () => {
    server.use(
      http.get('/api/mypage', async () => {
        return HttpResponse.json<IMyPageResponseData>({
          response: 'ok',
          message: '마이페이지 데이터 조회 성공',
          data: {
            userData: mockUserData.userData,
            isLinked: false,
            reviews: [],
            consults: [],
            comments: [],
          },
        });
      }),
    );

    const data: IMyPageResponseData = await (await fetch('/api/mypage')).json();
    renderWithQueryClient(<MyPagePage myPageData={data} />);

    expect(screen.getByText('예약 내역이 없습니다.')).toBeInTheDocument();
    expect(screen.getByText('새로운 예약을 추가해보세요.')).toBeInTheDocument();
    expect(screen.getByText('후기 내역이 없습니다.')).toBeInTheDocument();
    expect(screen.getByText('새로운 후기를 추가해보세요.')).toBeInTheDocument();
    expect(screen.getByText('댓글 내역이 없습니다.')).toBeInTheDocument();
    expect(screen.getByText('새로운 댓글을 추가해보세요.')).toBeInTheDocument();
  });

  it('회원 등급에 따라 grade badge가 올바르게 표시되는지 테스트', async () => {
    const data: IMyPageResponseData = await (await fetch('/api/mypage')).json();
    const { rerender } = renderWithQueryClient(<MyPagePage myPageData={data} />);

    expect(screen.getByTestId('basic-grade-badge')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-grade-badge')).not.toBeInTheDocument();

    // 관리자 등급 테스트
    const adminData: IMyPageResponseData = {
      ...data,
      data: {
        ...data.data,
        userData: { ...data.data.userData!, grade: 'admin' },
      },
    };
    rerender(<MyPagePage myPageData={adminData} />);
    expect(screen.getByTestId('admin-grade-badge')).toBeInTheDocument();
    expect(screen.queryByTestId('basic-grade-badge')).not.toBeInTheDocument();
  });

  it('가입한 OAuth provider에 따라 provider badge가 올바르게 표시되는지 테스트', async () => {
    const data: IMyPageResponseData = await (await fetch('/api/mypage')).json();
    const { rerender } = renderWithQueryClient(<MyPagePage myPageData={data} />);

    expect(screen.getByText('kakao')).toBeInTheDocument();
    expect(screen.queryByText('naver')).not.toBeInTheDocument();

    const naverProviderData: IMyPageResponseData = {
      ...data,
      data: {
        ...data.data,
        userData: { ...data.data.userData!, provider: 'naver' },
      },
    };
    rerender(<MyPagePage myPageData={naverProviderData} />);
    expect(screen.getByText('naver')).toBeInTheDocument();
    expect(screen.queryByText('kakao')).not.toBeInTheDocument();
  });

  it('전화번호 인증 상태에 따라 인증 badge가 올바르게 표시되는지 테스트', async () => {
    const data: IMyPageResponseData = await (await fetch('/api/mypage')).json();
    const { rerender } = renderWithQueryClient(<MyPagePage myPageData={data} />);

    expect(screen.getByText('전화번호 미인증')).toBeInTheDocument();
    expect(screen.queryByText('전화번호 인증완료')).not.toBeInTheDocument();

    const linkedData: IMyPageResponseData = {
      ...data,
      data: {
        ...data.data,
        isLinked: true,
      },
    };
    rerender(<MyPagePage myPageData={linkedData} />);
    expect(screen.getByText('전화번호 인증완료')).toBeInTheDocument();
    expect(screen.queryByText('전화번호 미인증')).not.toBeInTheDocument();
  });

  it('로그아웃 버튼 클릭 시 로그아웃 함수가 호출되는지 테스트', async () => {
    const data: IMyPageResponseData = await (await fetch('/api/mypage')).json();
    renderWithQueryClient(<MyPagePage myPageData={data} />);

    const logoutButton = screen.getByRole('button', { name: '로그아웃' });
    expect(logoutButton).toBeInTheDocument();

    // 로그아웃 버튼 클릭 시 로그아웃 함수가 호출되는지 테스트
    await userEvent.click(logoutButton);
    expect(logoutMock).toHaveBeenCalled();
  });

  it('정보수정 버튼 클릭 시 /mypage/edit으로 라우팅되는지 테스트', async () => {
    const data: IMyPageResponseData = await (await fetch('/api/mypage')).json();
    renderWithQueryClient(<MyPagePage myPageData={data} />);

    const editButton = screen.getByRole('button', { name: '정보수정' });
    expect(editButton).toBeInTheDocument();

    await userEvent.click(editButton);
    expect(pushMock).toHaveBeenCalledWith('/mypage/edit');
  });

  it('전화번호 인증 버튼 클릭 시 /signup/phone으로 라우팅되는지 테스트', async () => {
    const data: IMyPageResponseData = await (await fetch('/api/mypage')).json();
    renderWithQueryClient(<MyPagePage myPageData={data} />);

    const phoneAuthButton = screen.getByRole('button', { name: '전화번호 인증' });
    expect(phoneAuthButton).toBeInTheDocument();

    await userEvent.click(phoneAuthButton);
    expect(pushMock).toHaveBeenCalledWith('/signup/phone');
  });

  it('회원탈퇴 버튼 클릭 시 회원탈퇴 모달이 열리는지 테스트', async () => {
    const data: IMyPageResponseData = await (await fetch('/api/mypage')).json();
    renderWithQueryClient(<MyPagePage myPageData={data} />);

    const withdrawButton = screen.getByRole('button', { name: '회원탈퇴' });
    expect(withdrawButton).toBeInTheDocument();

    await userEvent.click(withdrawButton);
    expect(screen.getByText('회원 탈퇴')).toBeInTheDocument();
  });

  it('회원탈퇴 모달에서 취소 버튼 클릭 시 모달이 닫히는지 테스트', async () => {
    const setIsOpenMock = vi.fn();
    renderWithQueryClient(<WithdrawalModal isOpen={true} setIsOpen={setIsOpenMock} />);

    const cancelButton = screen.getByRole('button', { name: '닫기' });
    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(cancelButton);
    expect(setIsOpenMock).toHaveBeenCalledWith(false);
  });

  it('회원탈퇴 모달에서 약관 미동의 시 회원탈퇴 버튼이 disabled되는지 테스트', async () => {
    const setIsOpenMock = vi.fn();
    renderWithQueryClient(<WithdrawalModal isOpen={true} setIsOpen={setIsOpenMock} />);

    // 약관동의 안하면 버튼명이 '개인정보 처리 방침에 동의해주세요'로 바뀌고 disabled
    const withdrawButton = screen.getByRole('button', { name: '개인정보 처리 방침에 동의해주세요' });
    expect(screen.queryByText('회원탈퇴')).not.toBeInTheDocument();
    expect(withdrawButton).toBeInTheDocument();
    expect(withdrawButton).toBeDisabled();
  });

  it('회원탈퇴 모달에서 약관 동의 시에만 회원탈퇴 버튼이 활성화되는지 테스트', async () => {
    const setIsOpenMock = vi.fn();
    renderWithQueryClient(<WithdrawalModal isOpen={true} setIsOpen={setIsOpenMock} />);

    const withdrawButton = screen.getByRole('button', { name: '개인정보 처리 방침에 동의해주세요' });
    expect(withdrawButton).toBeInTheDocument();
    expect(withdrawButton).toBeDisabled();

    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);
    expect(withdrawButton).toBeEnabled();
    expect(screen.getByRole('button', { name: '탈퇴하기' })).toBeInTheDocument();
  });

  it('회원탈퇴 모달에서 회원탈퇴 버튼 클릭 시 회원탈퇴 함수가 호출되는지 테스트', async () => {
    const setIsOpenMock = vi.fn();
    renderWithQueryClient(<WithdrawalModal isOpen={true} setIsOpen={setIsOpenMock} />);

    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);

    const withdrawButton = screen.getByRole('button', { name: '탈퇴하기' });
    expect(withdrawButton).toBeInTheDocument();
    expect(withdrawButton).toBeEnabled();

    await userEvent.click(withdrawButton);
    expect(withdrawMock).toHaveBeenCalled();
  });
});
