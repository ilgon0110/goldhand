import { QueryClient } from '@tanstack/react-query';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';

import { EventPage } from '@/app/event/ui/EventPage';
import { eventKeys, userKeys } from '@/src/shared/config/queryKeys';
import type { IEventListResponseData, IUserResponseData } from '@/src/shared/types';
import { renderWithQueryClient } from '@/src/shared/utils/test/render';

vi.mock('@/src/shared/utils/verifyViewId', () => ({
  sendViewLog: vi.fn(),
}));

vi.mock('@/src/shared/hooks/useMediaQuery', () => ({
  useMediaQuery: () => true,
}));

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('nuqs', async () => {
  const originalModule = await vi.importActual('nuqs');
  return {
    ...originalModule,
    useQueryStates: () => [{ status: 'ALL', page: 1 }, vi.fn()],
  };
});

const mockNonUserData: IUserResponseData = {
  response: 'ok',
  message: '성공',
  accessToken: null,
  userData: null,
  isLinked: false,
};

function renderEventPage(eventListData: IEventListResponseData, userData: IUserResponseData = mockNonUserData) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(eventKeys.list({ page: 1, status: 'ALL' }), eventListData);
  queryClient.setQueryData(userKeys.all, userData);
  return renderWithQueryClient(
    <Suspense fallback={null}>
      <EventPage />
    </Suspense>,
    { queryClient },
  );
}

describe('Event Component', () => {
  it('렌더링 테스트. 이벤트 페이지가 렌더링된다', async () => {
    const eventListData = (await (await fetch('/api/event')).json()) as IEventListResponseData;

    renderEventPage(eventListData);

    expect(screen.getByText(/고운황금손 이벤트/)).toBeInTheDocument();
    for (const event of eventListData.eventData) {
      expect(await screen.findAllByText(event.title)).toBeTruthy();
      expect(await screen.findByTestId(event.id)).toBeInTheDocument();
    }
  });

  it('이벤트 페이지에서 이벤트 클릭 시 조회수 증가 및 "/event/[id] navigate가 호출되는지 확인', async () => {
    const eventListData = (await (await fetch('/api/event')).json()) as IEventListResponseData;

    renderEventPage(eventListData);

    const firstEvent = eventListData.eventData[0];
    const eventCard = await screen.findByTestId(firstEvent.id);
    await userEvent.click(eventCard);

    const { sendViewLog } = await import('@/src/shared/utils/verifyViewId');
    expect(sendViewLog).toHaveBeenNthCalledWith(1, eventListData.eventData[0].id);
    expect(pushMock).toHaveBeenNthCalledWith(1, `/event/${eventListData.eventData[0].id}`);
  });

  it('관리자일때 이벤트 생성 버튼이 보이는지 확인', async () => {
    const eventListData = (await (await fetch('/api/event')).json()) as IEventListResponseData;
    const userData = (await (await fetch('/api/user')).json()) as IUserResponseData;
    const adminData: IUserResponseData = {
      ...userData,
      userData: { ...userData.userData!, grade: 'admin' },
    };

    renderEventPage(eventListData, adminData);

    expect(screen.getByText('이벤트 만들기')).toBeInTheDocument();
  });

  it('관리자가 아닐 때 이벤트 생성 버튼이 보이지 않는지 확인', async () => {
    const eventListData = (await (await fetch('/api/event')).json()) as IEventListResponseData;
    const userData = (await (await fetch('/api/user')).json()) as IUserResponseData;

    renderEventPage(eventListData, userData);

    expect(screen.queryByText('이벤트 만들기')).not.toBeInTheDocument();
  });

  it('이벤트 상태 필터링 탭이 올바르게 동작하는지 확인', async () => {
    const eventListData = (await (await fetch('/api/event')).json()) as IEventListResponseData;
    const userData = (await (await fetch('/api/user')).json()) as IUserResponseData;

    renderEventPage(eventListData, userData);

    const allTab = screen.getByRole('tab', { name: '전체' });
    const upcomingTab = screen.getByRole('tab', { name: '예정' });
    const ongoingTab = screen.getByRole('tab', { name: '진행중' });
    const endedTab = screen.getByRole('tab', { name: '종료' });

    expect(allTab).toHaveAttribute('data-state', 'active');

    await userEvent.click(upcomingTab);
    expect(upcomingTab).toHaveAttribute('data-state', 'active');

    await userEvent.click(ongoingTab);
    expect(ongoingTab).toHaveAttribute('data-state', 'active');

    await userEvent.click(endedTab);
    expect(endedTab).toHaveAttribute('data-state', 'active');
  });

  it('모든 이벤트 카드가 올바른 testid로 렌더링되는지 확인', async () => {
    const eventListData = (await (await fetch('/api/event')).json()) as IEventListResponseData;
    const userData = (await (await fetch('/api/user')).json()) as IUserResponseData;

    renderEventPage(eventListData, userData);

    for (const event of eventListData.eventData) {
      expect(await screen.findByTestId(event.id)).toBeInTheDocument();
    }
  });
});
