import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import type { OnUrlUpdateFunction } from 'nuqs/adapters/testing';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';

import { server } from '@/src/__mock__/node';
import { apiUrl } from '@/src/shared/config';
import type { IReservationDetailData } from '@/src/shared/types';
import * as utils from '@/src/shared/utils';
import { renderWithQueryClient } from '@/src/shared/utils/test/render';
import { sendViewLog } from '@/src/shared/utils/verifyViewId';
import { ReservationListPage } from '@/src/views/reservation';

// sendViewLog 모킹
vi.mock('@/src/shared/utils/verifyViewId', () => ({
  sendViewLog: vi.fn(),
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

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => '/reservation/list',
  useSearchParams: () => new URLSearchParams('page=1&hideSecret=false'),
}));

interface IConsultData extends IReservationDetailData {
  id: string;
}

interface IReservationResponseData {
  message: string;
  consultData: IConsultData[];
  totalDataLength: number;
}
const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
describe('ReservationList Component', () => {
  it('예약 API에서 가져온 리뷰들의 데이터가 올바르게 렌더링되는지 확인', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderWithQueryClient(<ReservationListPage data={data} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          page: '1',
          hideSecret: 'false',
        },
        onUrlUpdate: onUrlUpdate,
      }),
    });

    for (const item of data.consultData) {
      expect(screen.getByTestId(item.id)).toBeInTheDocument();
    }
  });

  it('[비밀글] 클릭할 시 비밀번호 확인 모달이 나타나는지 확인', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderWithQueryClient(<ReservationListPage data={data} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          page: '1',
          hideSecret: 'false',
        },
        onUrlUpdate: onUrlUpdate,
      }),
    });

    const target = screen.getByTestId('890bdef9-2720-4924-b630-2c8f3803e4d5');
    await userEvent.click(target);
    expect(screen.getByText('비밀번호를 입력하세요.')).toBeInTheDocument();
  });

  it('[예약글] 클릭 시 바로 상세페이지로 이동하는지 확인', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderWithQueryClient(<ReservationListPage data={data} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          page: '1',
          hideSecret: 'false',
        },
        onUrlUpdate: onUrlUpdate,
      }),
    });

    for (const item of data.consultData) {
      if (item.secret) continue; // 비밀글은 건너뜀
      const reservationCard = screen.getByTestId(item.id);
      await userEvent.click(reservationCard);

      expect(pushMock).toHaveBeenCalledWith(`/reservation/list/${item.id}`);
    }
  });

  it('[비밀글] 비밀번호 확인 모달에서 올바른 비밀번호 입력 시 상세페이지로 이동하는지 확인', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderWithQueryClient(<ReservationListPage data={data} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          page: '1',
          hideSecret: 'false',
        },
        onUrlUpdate: onUrlUpdate,
      }),
    });

    const docId = '890bdef9-2720-4924-b630-2c8f3803e4d5';
    const target = screen.getByTestId(docId);
    await userEvent.click(target);
    expect(screen.getByText('비밀번호를 입력하세요.')).toBeInTheDocument();

    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: '확인' });

    await userEvent.type(passwordInput, 'aaaa');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith(`/reservation/list/${docId}`);
    });
  });

  it('[비밀글] 비밀번호 확인 모달에서 올바른 비밀번호 입력 시 조회수 증가 로직이 실행되는지 확인', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderWithQueryClient(<ReservationListPage data={data} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          page: '1',
          hideSecret: 'false',
        },
        onUrlUpdate: onUrlUpdate,
      }),
    });

    const docId = '890bdef9-2720-4924-b630-2c8f3803e4d5';
    const target = screen.getByTestId(docId);
    await userEvent.click(target);
    expect(screen.getByText('비밀번호를 입력하세요.')).toBeInTheDocument();

    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: '확인' });

    await userEvent.type(passwordInput, 'aaaa');
    expect(passwordInput.value).toBe('aaaa');

    await userEvent.click(submitButton);
    expect(sendViewLog).toHaveBeenCalledWith(docId);
  });

  it('[비밀글] 비밀번호 확인 모달에서 올바르지 않은 비밀번호 입력 시 에러 메시지가 나타나는지 확인', async () => {
    const handler = vi.fn(async () => {
      return HttpResponse.json({ response: 'ng', message: '비밀번호가 틀립니다.' });
    });
    server.use(http.post(`${apiUrl}/api/reservation/detail/password`, handler));
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderWithQueryClient(<ReservationListPage data={data} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          page: '1',
          hideSecret: 'false',
        },
        onUrlUpdate: onUrlUpdate,
      }),
    });

    const docId = '890bdef9-2720-4924-b630-2c8f3803e4d5';
    const target = screen.getByTestId(docId);
    await userEvent.click(target);
    expect(screen.getByText('비밀번호를 입력하세요.')).toBeInTheDocument();

    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: '확인' });

    await userEvent.type(passwordInput, 'aaab');
    expect(passwordInput.value).toBe('aaab');
    await userEvent.click(submitButton);
    expect(utils.toastError).toHaveBeenCalledWith('비밀번호가 틀립니다.');
  });

  it('[비밀글] 비밀번호 확인 모달에서 올바르지 않은 비밀번호 입력 시 조회수 증가 로직이 실행되지 않는지 확인', async () => {
    const handler = vi.fn(async () => {
      return HttpResponse.json({ response: 'ng', message: '비밀번호가 틀립니다.' });
    });
    server.use(http.post(`${apiUrl}/api/reservation/detail/password`, handler));
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderWithQueryClient(<ReservationListPage data={data} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          page: '1',
          hideSecret: 'false',
        },
        onUrlUpdate: onUrlUpdate,
      }),
    });

    const docId = '890bdef9-2720-4924-b630-2c8f3803e4d5';
    const target = screen.getByTestId(docId);
    await userEvent.click(target);
    expect(screen.getByText('비밀번호를 입력하세요.')).toBeInTheDocument();

    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: '확인' });

    await userEvent.type(passwordInput, 'aaab');
    expect(passwordInput.value).toBe('aaab');
    await userEvent.click(submitButton);
    expect(sendViewLog).not.toHaveBeenCalledWith(docId);
  });

  it('[예약글] 클릭 시 조회수 증가 로직이 실행되는지 확인', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderWithQueryClient(<ReservationListPage data={data} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          page: '1',
          hideSecret: 'false',
        },
        onUrlUpdate: onUrlUpdate,
      }),
    });

    for (const item of data.consultData) {
      if (item.secret) continue; // 비밀글은 건너뜀
      const reservationCard = screen.getByTestId(item.id);
      await userEvent.click(reservationCard);

      const { sendViewLog } = await import('@/src/shared/utils/verifyViewId');
      // sendViewLog와 push가 호출됐는지 확인
      expect(sendViewLog).toHaveBeenCalledWith(item.id);
    }
  });

  it('[예약글] 예약 리스트에서 예약 클릭 시 "/reservation/list/[id]" navigate가 호출되는지 확인', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderWithQueryClient(<ReservationListPage data={data} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          page: '1',
          hideSecret: 'false',
        },
        onUrlUpdate: onUrlUpdate,
      }),
    });

    for (const item of data.consultData) {
      if (item.secret) continue; // 비밀글은 건너뜀
      const reservationCard = screen.getByTestId(item.id);
      await userEvent.click(reservationCard);
      expect(pushMock).toHaveBeenCalledWith(`/reservation/list/${item.id}`);
    }
  });

  it('[비밀글] hideSecret queryParam이 false면 비밀글 안보기 체크박스가 체크 해제되어야 한다', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;
    renderWithQueryClient(<ReservationListPage data={data} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          page: '1',
          hideSecret: 'false',
        },
        onUrlUpdate: onUrlUpdate,
      }),
    });

    // 비밀글 안보기 check 상태 확인
    expect(screen.getByRole('checkbox', { name: '비밀글 안보기' })).not.toBeChecked();

    await userEvent.click(screen.getByLabelText('비밀글 안보기'));
    expect(screen.getByRole('checkbox', { name: '비밀글 안보기' })).toBeChecked();
  });

  it('[비밀글] hideSecret queryParam이 true면 비밀글 안보기 체크박스가 체크 되어야 한다', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;
    renderWithQueryClient(<ReservationListPage data={data} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          page: '1',
          hideSecret: 'true',
        },
        onUrlUpdate: onUrlUpdate,
      }),
    });

    // 비밀글 안보기 check 상태 확인
    expect(screen.getByRole('checkbox', { name: '비밀글 안보기' })).toBeChecked();

    await userEvent.click(screen.getByLabelText('비밀글 안보기'));
    expect(screen.getByRole('checkbox', { name: '비밀글 안보기' })).not.toBeChecked();
  });

  it('[비밀글] 비밀글 안보기 버튼을 눌렀을 때 hideSecret=false요청이 발생하는지 확인', async () => {
    const response = await fetch('/api/reservation?hideSecret=true');
    const data = (await response.json()) as IReservationResponseData;

    renderWithQueryClient(<ReservationListPage data={data} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          page: '1',
          hideSecret: 'true',
        },
        onUrlUpdate: onUrlUpdate,
      }),
    });

    // 비밀글 안보기 check 상태 확인
    expect(screen.getByRole('checkbox', { name: '비밀글 안보기' })).toBeChecked();

    await userEvent.click(screen.getByLabelText('비밀글 안보기'));
    expect(screen.getByRole('checkbox', { name: '비밀글 안보기' })).not.toBeChecked();

    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
      const callArg = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
      expect(callArg.queryString).not.toContain('hideSecret=true');
    });
  });

  it('[비밀글] 비밀글 안보기 버튼을 눌렀을 때 hideSecret=true요청이 발생하는지 확인', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderWithQueryClient(<ReservationListPage data={data} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          page: '1',
          hideSecret: 'false',
        },
        onUrlUpdate: onUrlUpdate,
      }),
    });

    // 비밀글 안보기 check 상태 확인
    expect(screen.getByRole('checkbox', { name: '비밀글 안보기' })).not.toBeChecked();

    await userEvent.click(screen.getByLabelText('비밀글 안보기'));
    expect(screen.getByRole('checkbox', { name: '비밀글 안보기' })).toBeChecked();
    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
      const callArg = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
      expect(callArg.queryString).toContain('hideSecret=true');
    });
  });

  it('[비밀글] 비밀글 안보기 버튼을 눌렀을 때 비밀글이 아닌 예약글만 보이는지 확인', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    const { rerender } = renderWithQueryClient(<ReservationListPage data={data} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          page: '1',
          hideSecret: 'false',
        },
        onUrlUpdate: onUrlUpdate,
      }),
    });

    // 1. 처음엔 비밀글, 비밀글 아닌 글 모두 보임
    for (const item of data.consultData) {
      expect(screen.getByTestId(item.id)).toBeInTheDocument();
    }

    await userEvent.click(screen.getByLabelText('비밀글 안보기'));

    // 쿼리 파라미터가 바뀌었다고 가정하고, 새 데이터를 fetch해서 다시 렌더링
    // 상위 테스트에서 쿼리 파라미터가 바뀌면 새 데이터가 fetch되는거 테스트 완료
    const response2 = await fetch('/api/reservation?hideSecret=true');
    const filteredData = (await response2.json()) as IReservationResponseData;

    rerender(<ReservationListPage data={filteredData} />);

    // 3. re-render: 비밀글이 아닌 예약글만 보이는지 테스트
    // (mock data를 직접 필터링해서 비교)
    const nonSecretItems = data.consultData.filter(item => !item.secret);

    // 비밀글 아닌 예약글은 모두 보임
    for (const item of nonSecretItems) {
      expect(await screen.findByTestId(item.id)).toBeInTheDocument();
    }
    // 비밀글은 보이지 않음
    for (const item of data.consultData.filter(item => item.secret)) {
      expect(screen.queryByTestId(item.id)).not.toBeInTheDocument();
    }
  });

  it('[비밀글] 비밀글 안보기 버튼을 다시 눌렀을 때 모든 예약글이 보이는지 확인', async () => {
    const response = await fetch('/api/reservation?hideSecret=true');
    const data = (await response.json()) as IReservationResponseData;

    const { rerender } = renderWithQueryClient(<ReservationListPage data={data} />, {
      wrapper: withNuqsTestingAdapter({
        searchParams: {
          page: '1',
          hideSecret: 'true',
        },
        onUrlUpdate: onUrlUpdate,
      }),
    });

    // 비밀글은 보이지 않음
    for (const item of data.consultData.filter(item => item.secret)) {
      expect(screen.queryByTestId(item.id)).not.toBeInTheDocument();
    }

    await userEvent.click(screen.getByLabelText('비밀글 안보기'));

    // 쿼리 파라미터가 바뀌었다고 가정하고, 새 데이터를 fetch해서 다시 렌더링
    // 상위 테스트에서 쿼리 파라미터가 바뀌면 새 데이터가 fetch되는거 테스트 완료
    const response2 = await fetch('/api/reservation?hideSecret=false');
    const filteredData = (await response2.json()) as IReservationResponseData;

    rerender(<ReservationListPage data={filteredData} />);

    // 비밀글도 보임
    for (const item of data.consultData.filter(item => item.secret)) {
      expect(await screen.findByTestId(item.id)).toBeInTheDocument();
    }

    // 비밀글 아닌 예약글도 보임
    for (const item of data.consultData.filter(item => !item.secret)) {
      expect(await screen.findByTestId(item.id)).toBeInTheDocument();
    }
  });
});
