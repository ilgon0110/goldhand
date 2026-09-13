import { QueryClient } from '@tanstack/react-query';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { Suspense } from 'react';

import { ReservationDetailPage } from '@/app/reservation/list/[docId]/ui/ReservationDetailPage';
import { server } from '@/src/__mock__/node';
import { mockReservationListData } from '@/src/__mock__/reservation';
import { apiUrl } from '@/src/shared/config';
import { reservationKeys, userKeys, viewCountKeys } from '@/src/shared/config/queryKeys';
import type { IReservationResponseData, IUserResponseData, IViewCountResponseData } from '@/src/shared/types';
import * as utils from '@/src/shared/utils';
import { renderWithQueryClient } from '@/src/shared/utils/test/render';

const pushMock = vi.fn();
const refreshMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, refresh: refreshMock }),
}));

vi.mock('@/src/shared/hooks/useScreenView', () => ({
  useScreenView: vi.fn(),
}));

vi.mock('@/src/widgets/reservation', async () => {
  const actual = await vi.importActual('@/src/widgets/reservation');
  return {
    ...actual,
    ReservationCommentForm: () => null,
    ReservationCommentList: () => null,
  };
});

vi.mock('@/src/shared/utils', async () => {
  const actual = await vi.importActual('@/src/shared/utils');
  return { ...actual, toastSuccess: vi.fn(), toastError: vi.fn() };
});

const docId = 'guest-reservation';
const guestReservationData: IReservationResponseData = {
  response: 'ok',
  message: '성공',
  data: {
    ...mockReservationListData.consultData![0],
    password: null,
    userId: null,
  },
};
const guestUserData: IUserResponseData = {
  response: 'ok',
  message: '성공',
  userData: null,
  isLinked: false,
};
const viewCountData: IViewCountResponseData = {
  response: 'ok',
  message: '성공',
  data: { totalViewCount: 1 },
};

function renderDetail(
  reservationData: IReservationResponseData = guestReservationData,
  userData: IUserResponseData = guestUserData,
) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(reservationKeys.detail(docId), reservationData);
  queryClient.setQueryData(userKeys.all, userData);
  queryClient.setQueryData(viewCountKeys.detail(docId), viewCountData);

  return renderWithQueryClient(
    <Suspense fallback={null}>
      <ReservationDetailPage docId={docId} />
    </Suspense>,
    { queryClient },
  );
}

function getPasswordInput() {
  return document.querySelector<HTMLInputElement>('input[type="password"]')!;
}

async function openEditPasswordDialog() {
  await userEvent.click(screen.getByRole('button', { name: '수정하기' }));
  await userEvent.type(getPasswordInput(), 'aaaa');
}

describe('ReservationDetailPage 수정 비밀번호 UX', () => {
  it('비밀번호 제출 직후 모달을 닫고 검증이 끝날 때까지 전면 로딩을 표시한다', async () => {
    let resolvePasswordRequest!: () => void;
    const passwordRequestGate = new Promise<void>(resolve => {
      resolvePasswordRequest = resolve;
    });
    server.use(
      http.post(`${apiUrl}/api/reservation/detail/password`, async () => {
        await passwordRequestGate;
        return HttpResponse.json({ response: 'ok', message: '비밀번호가 일치합니다.' });
      }),
    );
    renderDetail();

    await openEditPasswordDialog();
    await userEvent.click(screen.getByRole('button', { name: '확인' }));

    expect(screen.queryByText('비밀번호를 입력하세요.')).not.toBeInTheDocument();
    expect(await screen.findByRole('status')).toHaveTextContent('수정 페이지 이동 중...');
    expect(pushMock).not.toHaveBeenCalled();

    resolvePasswordRequest();
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(`/reservation/edit?docId=${docId}`);
    });
    expect(screen.getByRole('status')).toHaveTextContent('수정 페이지 이동 중...');
  });

  it('비밀번호가 틀리면 로딩을 종료하고 입력값을 초기화한 모달을 다시 연다', async () => {
    server.use(
      http.post(`${apiUrl}/api/reservation/detail/password`, () =>
        HttpResponse.json({ response: 'ng', message: '비밀번호가 틀립니다.' }),
      ),
    );
    renderDetail();

    await openEditPasswordDialog();
    await userEvent.click(screen.getByRole('button', { name: '확인' }));

    await waitFor(() => {
      expect(utils.toastError).toHaveBeenCalledWith('비밀번호가 틀립니다.');
    });
    expect(screen.getByText('비밀번호를 입력하세요.')).toBeInTheDocument();
    expect(getPasswordInput()).toHaveValue('');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('비밀번호 검증 요청이 실패하면 로딩을 종료하고 입력값을 초기화한 모달을 다시 연다', async () => {
    server.use(http.post(`${apiUrl}/api/reservation/detail/password`, () => HttpResponse.error()));
    renderDetail();

    await openEditPasswordDialog();
    await userEvent.click(screen.getByRole('button', { name: '확인' }));

    await waitFor(() => {
      expect(utils.toastError).toHaveBeenCalledWith('비밀번호 검증 중 서버 오류가 발생하였습니다.');
    });
    expect(screen.getByText('비밀번호를 입력하세요.')).toBeInTheDocument();
    expect(getPasswordInput()).toHaveValue('');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('회원 게시글은 비밀번호 확인 없이 수정 페이지로 이동한다', async () => {
    const memberReservationData: IReservationResponseData = {
      ...guestReservationData,
      data: { ...guestReservationData.data, userId: 'member-id' },
    };
    const memberUserData: IUserResponseData = {
      response: 'ok',
      message: '성공',
      isLinked: false,
      userData: {
        userId: 'member-id',
        email: 'member@example.com',
        name: '회원',
        phoneNumber: '01012345678',
        grade: 'basic',
        createdAt: { seconds: 0, nanoseconds: 0 },
        nickname: '회원',
        updatedAt: { seconds: 0, nanoseconds: 0 },
        isDeleted: false,
        deletedAt: null,
        provider: 'kakao',
        kakaoId: null,
        kakaoEmail: null,
        kakaoAlarmSettings: {
          alarmComment: false,
          alarmNews: false,
          alarmNewPost: false,
          alarmEditPost: false,
          alarmNewComment: false,
          alarmEditComment: false,
        },
      },
    };
    renderDetail(memberReservationData, memberUserData);

    await userEvent.click(screen.getByRole('button', { name: '수정하기' }));

    expect(pushMock).toHaveBeenCalledWith(`/reservation/edit?docId=${docId}`);
    expect(screen.queryByText('비밀번호를 입력하세요.')).not.toBeInTheDocument();
  });

  it('삭제 비밀번호 검증 중에는 기존 모달 흐름을 유지한다', async () => {
    let resolvePasswordRequest!: () => void;
    const passwordRequestGate = new Promise<void>(resolve => {
      resolvePasswordRequest = resolve;
    });
    server.use(
      http.post(`${apiUrl}/api/reservation/detail/password`, async () => {
        await passwordRequestGate;
        return HttpResponse.json({ response: 'ok', message: '비밀번호가 일치합니다.' });
      }),
    );
    renderDetail();

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));
    await userEvent.type(getPasswordInput(), 'aaaa');
    await userEvent.click(screen.getByRole('button', { name: '확인' }));

    expect(screen.getByText('비밀번호를 입력하세요.')).toBeInTheDocument();
    expect(screen.queryByText('수정 페이지 이동 중...')).not.toBeInTheDocument();

    resolvePasswordRequest();
    expect(await screen.findByText('게시글을 삭제하시겠습니까?')).toBeInTheDocument();
  });
});
