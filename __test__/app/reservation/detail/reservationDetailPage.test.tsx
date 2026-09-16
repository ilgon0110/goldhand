import { QueryClient } from '@tanstack/react-query';
import { screen, waitFor, within } from '@testing-library/react';
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

describe('ReservationDetailPage 비밀번호 및 삭제 UX', () => {
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

  it('삭제 비밀번호 인증 성공 시 같은 Dialog에서 확인 단계로 전환하고 검증한 비밀번호로 삭제한다', async () => {
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
    let resolveDeleteRequest!: () => void;
    const deleteRequestGate = new Promise<void>(resolve => {
      resolveDeleteRequest = resolve;
    });
    const deleteHandler = vi.fn(async () => {
      await deleteRequestGate;
      return HttpResponse.json({ response: 'ok', message: '삭제 성공' });
    });
    server.use(http.delete('/api/reservation/delete', deleteHandler));
    renderDetail();

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));
    const passwordDialog = screen.getByRole('dialog');
    expect(passwordDialog).toHaveClass('h-[60dvh]', 'aspect-auto', 'gap-6', 'sm:h-auto');
    await userEvent.type(getPasswordInput(), 'aaaa');
    await userEvent.click(screen.getByRole('button', { name: '확인' }));

    expect(screen.getByText('비밀번호를 입력하세요.')).toBeInTheDocument();
    expect(screen.queryByText('수정 페이지 이동 중...')).not.toBeInTheDocument();
    expect(within(passwordDialog).getByRole('button', { name: 'Close' })).toBeDisabled();

    resolvePasswordRequest();
    expect(await screen.findByText('게시글을 삭제하시겠습니까?')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBe(passwordDialog);

    await userEvent.click(within(passwordDialog).getByRole('button', { name: '삭제하기' }));
    expect(within(passwordDialog).getByRole('button', { name: 'Close' })).toBeDisabled();
    expect(within(passwordDialog).getByRole('button', { name: '취소하기' })).toBeDisabled();
    expect(within(passwordDialog).getByRole('status').closest('button')).toBeDisabled();

    resolveDeleteRequest();
    await waitFor(async () => {
      expect(deleteHandler).toHaveBeenCalled();
      const calls = deleteHandler.mock.calls as unknown as { request: Request }[][];
      expect(await calls[0][0].request.json()).toEqual({ docId, password: 'aaaa', userId: null });
    });
    expect(pushMock).toHaveBeenCalledWith('/reservation/list');
  });

  it('삭제 요청 실패 시 같은 확인 단계에서 재시도를 허용한다', async () => {
    server.use(
      http.delete('/api/reservation/delete', () =>
        HttpResponse.json({ response: 'ng', message: '삭제에 실패했습니다.' }, { status: 500 }),
      ),
    );
    renderDetail();

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));
    await userEvent.type(getPasswordInput(), 'aaaa');
    await userEvent.click(screen.getByRole('button', { name: '확인' }));
    const dialog = await screen.findByRole('dialog');
    await screen.findByText('게시글을 삭제하시겠습니까?');
    await userEvent.click(within(dialog).getByRole('button', { name: '삭제하기' }));

    await waitFor(() => {
      expect(utils.toastError).toHaveBeenCalledWith('삭제에 실패했습니다.');
    });
    expect(within(dialog).getByText('게시글을 삭제하시겠습니까?')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: '삭제하기' })).toBeEnabled();
  });

  it('삭제 확인 단계에서 취소할 때 비밀번호 입력 화면이 다시 노출되지 않는다', async () => {
    renderDetail();

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));
    await userEvent.type(getPasswordInput(), 'aaaa');
    await userEvent.click(screen.getByRole('button', { name: '확인' }));
    await screen.findByText('게시글을 삭제하시겠습니까?');

    await userEvent.click(screen.getByRole('button', { name: '취소하기' }));

    expect(screen.queryByText('비밀번호를 입력하세요.')).not.toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
