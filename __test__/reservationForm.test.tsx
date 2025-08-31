import { Timestamp } from '@firebase/firestore';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { IUserResponseData } from '@/src/shared/types';
import { ReservationApplyPage } from '@/src/views/reservation/apply/ui/ReservationApplyPage';
import { ReservationFormPage } from '@/src/views/reservation/form/ui/ReservationFormPage';

const mockUserData: IUserResponseData = {
  response: 'ok',
  message: '성공',
  accessToken: 'token',
  userData: {
    userId: 'testUserId',
    email: 'test@example.com',
    name: 'Test User',
    phoneNumber: '010-1234-5678',
    grade: 'silver',
    nickname: 'Tester',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    isDeleted: false,
    deletedAt: null,
    provider: 'kakao',
    kakaoId: 'kakao123',
    kakaoEmail: 'kakao@example.com',
  },
  isLinked: false,
};

// 라우터 mock
const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('react-google-recaptcha-v3', () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: () => Promise.resolve('recaptcha-token'),
  }),
}));

vi.mock('@/src/shared/ui/calendar', async () => {
  return {
    Calendar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

describe('ReservationForm Component', () => {
  it('비회원일 경우에만 비밀번호 입력창이 보인다.', async () => {
    render(<ReservationApplyPage />);

    await userEvent.click(screen.getByRole('button', { name: '비회원으로 문의하기' }));

    expect(pushMock).toHaveBeenCalledWith('/reservation/form');

    render(<ReservationFormPage userData={mockUserData} />);

    expect(screen.queryByLabelText(/비밀번호/)).toBeInTheDocument();
  });

  it('필수 입력값이 모두 입력되어야 제출 버튼이 활성화된다.', async () => {});

  it('제출 버튼을 눌렀을 때, 예약 API에 POST 요청이 전송되는지 확인', async () => {});

  it('제출 버튼을 눌렀을 때, 제출 중 상태가 보이는지 확인', async () => {});

  it('제출 버튼을 눌렀을 때, 제출 도중 user session이 만료된 경우 해당 에러 메세지가 보이고 /login으로 이동하는지 확인', async () => {});

  it('제출 버튼을 눌렀을 때, 제출이 성공하면 /reservation/list로 이동하는지 확인', async () => {});

  it('제출 버튼을 눌렀을 때, 제출이 실패하면 전달받은 에러 메세지가 보이는지 확인', async () => {});
});
