import { QueryClient } from '@tanstack/react-query';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import type { OnUrlUpdateFunction } from 'nuqs/adapters/testing';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';
import { Suspense } from 'react';

import { ReservationListPage } from '@/app/reservation/list/ui/ReservationListPage';
import { server } from '@/src/__mock__/node';
import { apiUrl } from '@/src/shared/config';
import { reservationKeys } from '@/src/shared/config/queryKeys';
import type { IReservationDetailData } from '@/src/shared/types';
import * as utils from '@/src/shared/utils';
import { renderWithQueryClient } from '@/src/shared/utils/test/render';
import { sendViewLog } from '@/src/shared/utils/verifyViewId';

vi.mock('@/src/shared/utils/verifyViewId', () => ({
  sendViewLog: vi.fn(),
}));

vi.mock('@/src/shared/utils', async () => {
  const actual = await vi.importActual('@/src/shared/utils');
  return { ...actual, toastSuccess: vi.fn(), toastError: vi.fn() };
});

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
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

function renderList(
  data: IReservationResponseData,
  searchParams: { page: string; hideSecret: string } = { page: '1', hideSecret: 'false' },
  toggledData?: IReservationResponseData,
) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const page = Number(searchParams.page);
  queryClient.setQueryData(reservationKeys.list({ page, hideSecret: searchParams.hideSecret }), data);
  // Pre-seed the toggled hideSecret state to prevent network calls when toggle is clicked
  const toggledHideSecret = searchParams.hideSecret === 'true' ? 'false' : 'true';
  queryClient.setQueryData(reservationKeys.list({ page, hideSecret: toggledHideSecret }), toggledData ?? data);
  return renderWithQueryClient(
    <Suspense fallback={null}>
      <ReservationListPage />
    </Suspense>,
    {
      queryClient,
      wrapper: withNuqsTestingAdapter({ searchParams, onUrlUpdate }),
    },
  );
}

describe('ReservationList Component', () => {
  it('예약 API에서 가져온 리뷰들의 데이터가 올바르게 렌더링되는지 확인', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderList(data);

    for (const item of data.consultData) {
      expect(screen.getByTestId(item.id)).toBeInTheDocument();
    }
  });

  it('[비밀글] 클릭할 시 비밀번호 확인 모달이 나타나는지 확인', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderList(data);

    const target = screen.getByTestId('890bdef9-2720-4924-b630-2c8f3803e4d5');
    await userEvent.click(target);
    expect(screen.getByText('비밀번호를 입력하세요.')).toBeInTheDocument();
  });

  it('[예약글] 클릭 시 바로 상세페이지로 이동하는지 확인', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderList(data);

    for (const item of data.consultData) {
      if (item.secret) continue;
      const reservationCard = screen.getByTestId(item.id);
      await userEvent.click(reservationCard);
      expect(pushMock).toHaveBeenCalledWith(`/reservation/list/${item.id}`);
    }
  });

  it('[비밀글] 비밀번호 확인 모달에서 올바른 비밀번호 입력 시 상세페이지로 이동하는지 확인', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderList(data);

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

    renderList(data);

    const docId = '890bdef9-2720-4924-b630-2c8f3803e4d5';
    const target = screen.getByTestId(docId);
    await userEvent.click(target);

    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: '확인' });

    await userEvent.type(passwordInput, 'aaaa');
    expect(passwordInput.value).toBe('aaaa');
    await userEvent.click(submitButton);
    expect(sendViewLog).toHaveBeenCalledWith(docId);
  });

  it('[비밀글] 비밀번호 확인 모달에서 올바르지 않은 비밀번호 입력 시 에러 메시지가 나타나는지 확인', async () => {
    server.use(
      http.post(`${apiUrl}/api/reservation/detail/password`, async () =>
        HttpResponse.json({ response: 'ng', message: '비밀번호가 틀립니다.' }),
      ),
    );
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderList(data);

    const docId = '890bdef9-2720-4924-b630-2c8f3803e4d5';
    await userEvent.click(screen.getByTestId(docId));

    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    await userEvent.type(passwordInput, 'aaab');
    await userEvent.click(screen.getByRole('button', { name: '확인' }));
    expect(utils.toastError).toHaveBeenCalledWith('비밀번호가 틀립니다.');
  });

  it('[비밀글] 비밀번호 확인 모달에서 올바르지 않은 비밀번호 입력 시 조회수 증가 로직이 실행되지 않는지 확인', async () => {
    server.use(
      http.post(`${apiUrl}/api/reservation/detail/password`, async () =>
        HttpResponse.json({ response: 'ng', message: '비밀번호가 틀립니다.' }),
      ),
    );
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderList(data);

    const docId = '890bdef9-2720-4924-b630-2c8f3803e4d5';
    await userEvent.click(screen.getByTestId(docId));

    const passwordInput = screen.getByTestId('password-input') as HTMLInputElement;
    await userEvent.type(passwordInput, 'aaab');
    await userEvent.click(screen.getByRole('button', { name: '확인' }));
    expect(sendViewLog).not.toHaveBeenCalledWith(docId);
  });

  it('[예약글] 클릭 시 조회수 증가 로직이 실행되는지 확인', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderList(data);

    for (const item of data.consultData) {
      if (item.secret) continue;
      const reservationCard = screen.getByTestId(item.id);
      await userEvent.click(reservationCard);
      const { sendViewLog } = await import('@/src/shared/utils/verifyViewId');
      expect(sendViewLog).toHaveBeenCalledWith(item.id);
    }
  });

  it('[예약글] 예약 리스트에서 예약 클릭 시 "/reservation/list/[id]" navigate가 호출되는지 확인', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderList(data);

    for (const item of data.consultData) {
      if (item.secret) continue;
      await userEvent.click(screen.getByTestId(item.id));
      expect(pushMock).toHaveBeenCalledWith(`/reservation/list/${item.id}`);
    }
  });

  it('[비밀글] hideSecret queryParam이 false면 비밀글 안보기 체크박스가 체크 해제되어야 한다', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;
    renderList(data, { page: '1', hideSecret: 'false' });

    expect(screen.getByRole('button', { name: /비밀글 안보기/ })).toHaveAttribute('aria-pressed', 'false');

    await userEvent.click(screen.getByRole('button', { name: /비밀글 안보기/ }));
    expect(screen.getByRole('button', { name: /비밀글 안보기/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('[비밀글] hideSecret queryParam이 true면 비밀글 안보기 체크박스가 체크 되어야 한다', async () => {
    const response = await fetch('/api/reservation?hideSecret=true');
    const data = (await response.json()) as IReservationResponseData;
    renderList(data, { page: '1', hideSecret: 'true' });

    expect(screen.getByRole('button', { name: /비밀글 안보기/ })).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(screen.getByRole('button', { name: /비밀글 안보기/ }));
    expect(screen.getByRole('button', { name: /비밀글 안보기/ })).toHaveAttribute('aria-pressed', 'false');
  });

  it('[비밀글] 비밀글 안보기 버튼을 눌렀을 때 hideSecret=false요청이 발생하는지 확인', async () => {
    const response = await fetch('/api/reservation?hideSecret=true');
    const data = (await response.json()) as IReservationResponseData;

    renderList(data, { page: '1', hideSecret: 'true' });

    expect(screen.getByRole('button', { name: /비밀글 안보기/ })).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(screen.getByRole('button', { name: /비밀글 안보기/ }));
    expect(screen.getByRole('button', { name: /비밀글 안보기/ })).toHaveAttribute('aria-pressed', 'false');

    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
      const callArg = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
      expect(callArg.queryString).not.toContain('hideSecret=true');
    });
  });

  it('[비밀글] 비밀글 안보기 버튼을 눌렀을 때 hideSecret=true요청이 발생하는지 확인', async () => {
    const response = await fetch('/api/reservation');
    const data = (await response.json()) as IReservationResponseData;

    renderList(data, { page: '1', hideSecret: 'false' });

    await userEvent.click(screen.getByRole('button', { name: /비밀글 안보기/ }));

    await waitFor(() => {
      expect(onUrlUpdate).toHaveBeenCalled();
      const callArg = onUrlUpdate.mock.calls[onUrlUpdate.mock.calls.length - 1][0];
      expect(callArg.queryString).toContain('hideSecret=true');
    });
  });

  it('[비밀글] 비밀글 안보기 상태에서 비밀글 아닌 예약글만 렌더링되는지 확인', async () => {
    const response = await fetch('/api/reservation?hideSecret=true');
    const filteredData = (await response.json()) as IReservationResponseData;

    renderList(filteredData, { page: '1', hideSecret: 'true' });

    const nonSecretItems = filteredData.consultData.filter(item => !item.secret);
    for (const item of nonSecretItems) {
      expect(await screen.findByTestId(item.id)).toBeInTheDocument();
    }
    for (const item of filteredData.consultData.filter(item => item.secret)) {
      expect(screen.queryByTestId(item.id)).not.toBeInTheDocument();
    }
  });

  it('[비밀글] 비밀글 안보기 해제 상태에서 모든 예약글이 렌더링되는지 확인', async () => {
    const response = await fetch('/api/reservation');
    const allData = (await response.json()) as IReservationResponseData;

    renderList(allData, { page: '1', hideSecret: 'false' });

    for (const item of allData.consultData) {
      expect(await screen.findByTestId(item.id)).toBeInTheDocument();
    }
  });
});
