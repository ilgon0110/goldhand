import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { IReviewData } from '@/src/views/review';
import { ReviewPage } from '@/src/views/review';

// sendViewLog 모킹
vi.mock('@/src/shared/utils/verifyViewId', () => ({
  sendViewLog: vi.fn(),
}));

// useRouter 모킹
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
        franchisee: '전체',
        page: '1',
      },
      vi.fn(),
    ],
  };
});

describe('ReviewPage 통합 테스트', () => {
  it('리뷰페이지 API에서 가져온 리뷰들의 데이터가 올바르게 렌더링되는지 확인', async () => {
    const response = await fetch('/api/review?page=1&franchisee=전체');
    const data = (await response.json()) as IReviewData;

    // 데이터를 기반으로 ReviewPage 컴포넌트를 렌더링합니다.
    render(<ReviewPage data={data} isLogin={false} />);

    // 리뷰 데이터가 올바르게 렌더링되었는지 확인합니다.
    data.reviewData.forEach(async review => {
      // findBy- : 특정 요소가 비동기적으로 렌더링될 때 사용
      expect(await screen.findAllByText(review.title)).toBeTruthy();
      expect(await screen.findByTestId(review.id)).toBeInTheDocument();
    });
  });

  it('리뷰 페이지에서 리뷰 클릭 시 조회수 증가 및 "/review/[id] navigate가 호출되는지 확인', async () => {
    const response = await fetch('/api/review?page=1&franchisee=전체');
    const data = (await response.json()) as IReviewData;

    // 데이터를 기반으로 ReviewPage 컴포넌트를 렌더링합니다.
    render(<ReviewPage data={data} isLogin={false} />);

    // 첫 번째 리뷰 클릭
    const firstReview = data.reviewData[0];
    const reviewCard = await screen.findByTestId(`${firstReview.id}-card-review`);
    await userEvent.click(reviewCard);

    const { sendViewLog } = await import('@/src/shared/utils/verifyViewId');
    // sendViewLog와 push가 호출됐는지 확인
    expect(sendViewLog).toHaveBeenNthCalledWith(1, data.reviewData[0].id);
    expect(pushMock).toHaveBeenNthCalledWith(1, `/review/${data.reviewData[0].id}`);
  });
});

// Shadcn UI Select 컴포넌트를 사용하여 Select 기본 기능은 별도로 테스트하지 않음
describe('ReviewPageHeader 컴포넌트 테스트', async () => {
  it('비로그인일때 후기 작성 버튼이 비활성화인지 확인', async () => {
    const response = await fetch('/api/review?page=1&franchisee=전체');
    const data = (await response.json()) as IReviewData;

    // 데이터를 기반으로 ReviewPage 컴포넌트를 렌더링합니다.
    render(<ReviewPage data={data} isLogin={false} />);
    const reviewButton = screen.queryByRole('button', { name: '로그인 후 작성 가능' });

    expect(reviewButton).toBeInTheDocument();
    expect(reviewButton).toBeDisabled();
  });

  it('로그인일때 후기 작성 버튼이 활성화 되는지 확인', async () => {
    const response = await fetch('/api/review?page=1&franchisee=전체');
    const data = (await response.json()) as IReviewData;

    // 데이터를 기반으로 ReviewPage 컴포넌트를 렌더링합니다.
    render(<ReviewPage data={data} isLogin={true} />);
    const reviewButton = screen.queryByRole('button', { name: '후기 남기기' });

    expect(reviewButton).toBeInTheDocument();
    expect(reviewButton).toBeEnabled();
  });

  it('cardView/tableView Button을 클릭했을 때 그에 맞게 UI가 변경되는지 확인', async () => {
    const response = await fetch('/api/review?page=1&franchisee=전체');
    const data = (await response.json()) as IReviewData;

    // 데이터를 기반으로 ReviewPage 컴포넌트를 렌더링합니다.
    render(<ReviewPage data={data} isLogin={false} />);

    // 초기 상태에서 CARD 모드가 활성화되어 있는지 확인
    for (const review of data.reviewData) {
      expect(await screen.findByTestId(`${review.id}-card-review`)).toBeInTheDocument();
      expect(screen.queryByTestId(`${review.id}-table-review`)).not.toBeInTheDocument();
    }

    // TABLE 모드로 전환
    await userEvent.click(screen.getByRole('button', { name: 'table-view-button' }));

    // TABLE 모드가 활성화되었는지 확인
    for (const review of data.reviewData) {
      expect(await screen.findByTestId(`${review.id}-table-review`)).toBeInTheDocument();
      expect(screen.queryByTestId(`${review.id}-card-review`)).not.toBeInTheDocument();
    }

    // CARD 모드로 전환
    await userEvent.click(screen.getByRole('button', { name: 'card-view-button' }));

    for (const review of data.reviewData) {
      expect(await screen.findByTestId(`${review.id}-card-review`)).toBeInTheDocument();
      expect(screen.queryByTestId(`${review.id}-table-review`)).not.toBeInTheDocument();
    }
  });
});
