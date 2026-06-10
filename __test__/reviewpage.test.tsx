import { QueryClient } from '@tanstack/react-query';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Suspense } from 'react';

import { ReviewPage } from '@/app/review/ui/ReviewPage';
import { reviewKeys, userKeys } from '@/src/shared/config/queryKeys';
import type { IReviewListResponseData, IUserResponseData } from '@/src/shared/types';
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
    useQueryStates: () => [{ franchisee: '전체', page: 1 }, vi.fn()],
  };
});

const mockNonUserData: IUserResponseData = {
  response: 'ok',
  message: '성공',
  accessToken: null,
  userData: null,
  isLinked: false,
};

function renderReviewPage(data: IReviewListResponseData, userData: IUserResponseData = mockNonUserData) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(reviewKeys.list({ page: 1, franchisee: '전체' }), data);
  queryClient.setQueryData(userKeys.all, userData);
  return renderWithQueryClient(
    <Suspense fallback={null}>
      <ReviewPage />
    </Suspense>,
    { queryClient },
  );
}

describe('ReviewPage 통합 테스트', () => {
  it('리뷰페이지 API에서 가져온 리뷰들의 데이터가 올바르게 렌더링되는지 확인', async () => {
    const response = await fetch('/api/review?page=1&franchisee=전체');
    const data = (await response.json()) as IReviewListResponseData;

    renderReviewPage(data);

    for (const review of data.reviewData) {
      expect(await screen.findByTestId(review.id)).toBeInTheDocument();
    }
  });

  it('리뷰 페이지에서 리뷰 클릭 시 조회수 증가 및 "/review/[id] navigate가 호출되는지 확인', async () => {
    const response = await fetch('/api/review?page=1&franchisee=전체');
    const data = (await response.json()) as IReviewListResponseData;

    renderReviewPage(data);

    const firstReview = data.reviewData[0];
    const reviewCard = await screen.findByTestId(firstReview.id);
    await userEvent.click(reviewCard);

    const { sendViewLog } = await import('@/src/shared/utils/verifyViewId');
    expect(sendViewLog).toHaveBeenNthCalledWith(1, data.reviewData[0].id);
    expect(pushMock).toHaveBeenNthCalledWith(1, `/review/${data.reviewData[0].id}`);
  });
});

describe('ReviewPageHeader 컴포넌트 테스트', async () => {
  it('비로그인일때 후기 작성 버튼이 비활성화인지 확인', async () => {
    const response = await fetch('/api/review?page=1&franchisee=전체');
    const data = (await response.json()) as IReviewListResponseData;

    renderReviewPage(data, mockNonUserData);

    const reviewButton = screen.queryByRole('button', { name: '로그인 후 작성' });
    expect(reviewButton).toBeInTheDocument();
    expect(reviewButton).toBeDisabled();
  });

  it('로그인일때 후기 작성 버튼이 활성화 되는지 확인', async () => {
    const response = await fetch('/api/review?page=1&franchisee=전체');
    const data = (await response.json()) as IReviewListResponseData;
    const userData = await (await fetch('/api/user')).json();

    renderReviewPage(data, userData);

    const reviewButton = screen.queryByRole('button', { name: '후기 남기기' });
    expect(reviewButton).toBeInTheDocument();
    expect(reviewButton).toBeEnabled();
  });

  it('모든 리뷰 카드가 올바른 testid로 렌더링되는지 확인', async () => {
    const response = await fetch('/api/review?page=1&franchisee=전체');
    const data = (await response.json()) as IReviewListResponseData;

    renderReviewPage(data);

    for (const review of data.reviewData) {
      expect(await screen.findByTestId(review.id)).toBeInTheDocument();
    }
  });
});
