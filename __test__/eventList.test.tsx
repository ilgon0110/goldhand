import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { IUserResponseData } from '@/src/shared/types';
import { EventPage } from '@/src/views/event';

// sendViewLog 모킹
vi.mock('@/src/shared/utils/verifyViewId', () => ({
  sendViewLog: vi.fn(),
}));

vi.mock('@/src/shared/hooks/useMediaQuery', () => ({
  useMediaQuery: () => true, // 항상 데스크탑 뷰포트로 간주
}));

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('nuqs', async () => {
  const originalModule = await vi.importActual('nuqs');

  return {
    ...originalModule,
    useQueryStates: () => [
      {
        status: 'ALL',
        page: '1',
      },
      vi.fn(),
    ],
  };
});

describe('Event Component', () => {
  it('렌더링 테스트. 이벤트 페이지가 렌더링된다', async () => {
    const eventData = await (await fetch('/api/event')).json();
    const userData = await (await fetch('/api/user')).json();

    render(
      <EventPage
        eventData={eventData.eventData}
        totalDataLength={eventData.totalDataLength}
        userData={userData.userData}
      />,
    );

    expect(screen.getByText('고운황금손 이벤트')).toBeInTheDocument();

    for (const event of eventData.eventData) {
      expect(await screen.findAllByText(event.title)).toBeTruthy();
      expect(await screen.findByTestId(event.id)).toBeInTheDocument();
    }
  });

  it('이벤트 페이지에서 이벤트 클릭 시 조회수 증가 및 "/event/[id] navigate가 호출되는지 확인', async () => {
    const eventData = await (await fetch('/api/event')).json();
    const userData = await (await fetch('/api/user')).json();

    render(
      <EventPage
        eventData={eventData.eventData}
        totalDataLength={eventData.totalDataLength}
        userData={userData.userData}
      />,
    );
    // 첫 번째 이벤트 클릭
    const firstEvent = eventData.eventData[0];
    const eventCard = await screen.findByTestId(`${firstEvent.id}-card-review`);
    await userEvent.click(eventCard);

    const { sendViewLog } = await import('@/src/shared/utils/verifyViewId');
    // sendViewLog와 push가 호출됐는지 확인
    expect(sendViewLog).toHaveBeenNthCalledWith(1, eventData.eventData[0].id);
    expect(pushMock).toHaveBeenNthCalledWith(1, `/event/${eventData.eventData[0].id}`);
  });

  it('관리자일때 이벤트 생성 버튼이 보이는지 확인', async () => {
    const eventData = await (await fetch('/api/event')).json();
    const userData: IUserResponseData = await (await fetch('/api/user')).json();
    // 관리자 등급 테스트
    const adminData: IUserResponseData = {
      ...userData,
      userData: {
        ...userData.userData!,
        grade: 'admin',
      },
    };

    render(
      <EventPage
        eventData={eventData.eventData}
        totalDataLength={eventData.totalDataLength}
        userData={adminData.userData}
      />,
    );

    expect(screen.getByText('이벤트 만들기')).toBeInTheDocument();
  });

  it('관리자가 아닐 때 이벤트 생성 버튼이 보이지 않는지 확인', async () => {
    const eventData = await (await fetch('/api/event')).json();
    const userData: IUserResponseData = await (await fetch('/api/user')).json();

    render(
      <EventPage
        eventData={eventData.eventData}
        totalDataLength={eventData.totalDataLength}
        userData={userData.userData}
      />,
    );

    expect(screen.queryByText('이벤트 만들기')).not.toBeInTheDocument();
  });

  it('이벤트 상태 필터링 탭이 올바르게 동작하는지 확인', async () => {
    const eventData = await (await fetch('/api/event')).json();
    const userData: IUserResponseData = await (await fetch('/api/user')).json();

    render(
      <EventPage
        eventData={eventData.eventData}
        totalDataLength={eventData.totalDataLength}
        userData={userData.userData}
      />,
    );

    const allTab = screen.getByText('전체');
    const upcomingTab = screen.getByText('예정');
    const ongoingTab = screen.getByText('진행중');
    const endedTab = screen.getByText('종료');

    // 초기 상태는 '전체' 탭이 선택된 상태
    expect(allTab).toHaveAttribute('data-state', 'active');

    // '예정' 탭 클릭
    await userEvent.click(upcomingTab);
    expect(upcomingTab).toHaveAttribute('data-state', 'active');

    // '진행중' 탭 클릭
    await userEvent.click(ongoingTab);
    expect(ongoingTab).toHaveAttribute('data-state', 'active');

    // '종료' 탭 클릭
    await userEvent.click(endedTab);
    expect(endedTab).toHaveAttribute('data-state', 'active');
  });

  it('cardView/tableView Button을 클릭했을 때 그에 맞게 UI가 변경되는지 확인', async () => {
    const eventData = await (await fetch('/api/event')).json();
    const userData: IUserResponseData = await (await fetch('/api/user')).json();

    render(
      <EventPage
        eventData={eventData.eventData}
        totalDataLength={eventData.totalDataLength}
        userData={userData.userData}
      />,
    );

    // 초기 상태에서 CARD 모드가 활성화되어 있는지 확인
    for (const event of eventData.eventData) {
      expect(await screen.findByTestId(`${event.id}-card-review`)).toBeInTheDocument();
      expect(screen.queryByTestId(`${event.id}-table-review`)).not.toBeInTheDocument();
    }

    // TABLE 모드로 전환
    await userEvent.click(screen.getByRole('button', { name: 'table-view-button' }));

    // TABLE 모드가 활성화되었는지 확인
    for (const event of eventData.eventData) {
      expect(await screen.findByTestId(`${event.id}-table-review`)).toBeInTheDocument();
      expect(screen.queryByTestId(`${event.id}-card-review`)).not.toBeInTheDocument();
    }

    // CARD 모드로 전환
    await userEvent.click(screen.getByRole('button', { name: 'card-view-button' }));

    for (const event of eventData.eventData) {
      expect(await screen.findByTestId(`${event.id}-card-review`)).toBeInTheDocument();
      expect(screen.queryByTestId(`${event.id}-table-review`)).not.toBeInTheDocument();
    }
  });
});
