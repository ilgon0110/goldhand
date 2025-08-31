import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Timestamp } from 'firebase/firestore';

import type { IReviewResponseData, IUserResponseData, IViewCountResponseData } from '@/src/shared/types';
import { ReviewDetailPage } from '@/src/views/review/form/ui/ReviewDetailPage';

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('@/src/widgets/Comment', () => {
  return {
    Comment: () => <div>Comment Mock Component</div>,
    useComments: () => ({
      comments: [],
      loading: false,
    }),
  };
});

vi.mock('@/src/widgets/editor/ui/Editor', () => {
  return {
    Editor: () => <div>Editor Mock Component</div>,
  };
});

const mockReviewData: IReviewResponseData = {
  response: 'ok',
  message: '성공',
  data: {
    htmlString: '<p>Test Review Content</p>',
    createdAt: Timestamp.now(),
    franchisee: 'Test Franchisee',
    name: 'Test Name',
    title: 'Test Title',
    updatedAt: Timestamp.now(),
    userId: 'testUserId',
    comments: null,
  },
};

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
  isLinked: true,
};

const mockViewCountData: IViewCountResponseData = {
  response: 'ok',
  message: '성공',
  data: { totalViewCount: 100 },
};

describe('ReviewDetailPage 컴포넌트 테스트', () => {
  it('렌더링 테스트', () => {
    render(
      <ReviewDetailPage
        data={mockReviewData}
        docId="docId"
        userData={mockUserData}
        viewCountData={mockViewCountData}
      />,
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('수정하기 버튼을 눌렀을 때 확인 모달이 뜨고, 확인을 누르면 수정 페이지로 이동한다.', async () => {
    render(
      <ReviewDetailPage
        data={mockReviewData}
        docId="docId"
        userData={mockUserData}
        viewCountData={mockViewCountData}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: '수정하기' }));
    expect(screen.getByText('게시글 수정')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '수정하기' }));
    expect(pushMock).toHaveBeenCalledWith('/review/docId/edit');
  });

  it('삭제하기 버튼을 눌렀을 때 확인 모달이 뜨고, 취소를 누르면 모달이 닫힌다.', async () => {
    render(
      <ReviewDetailPage
        data={mockReviewData}
        docId="docId"
        userData={mockUserData}
        viewCountData={mockViewCountData}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));
    expect(screen.getByText('게시글을 삭제하시겠습니까?')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '취소하기' }));
    expect(screen.queryByText('삭제된 게시글은 복구할 수 없습니다.')).not.toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
  it('삭제하기 버튼을 눌렀을 때 확인 모달이 뜨고, 확인을 누르면 삭제 요청이 보내지고, 삭제가 성공하면 리뷰 목록 페이지로 이동한다.', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: 'ok' }),
    } as Response);

    render(
      <ReviewDetailPage
        data={mockReviewData}
        docId="docId"
        userData={mockUserData}
        viewCountData={mockViewCountData}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));
    expect(screen.getByText('게시글을 삭제하시겠습니까?')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));

    expect(global.fetch).toHaveBeenCalledWith('/api/review/delete', expect.any(Object));

    // 삭제가 성공하면 리뷰 목록 페이지로 이동
    // 모달이 닫히고 나서 push가 호출되므로, 약간의 딜레이를 줌
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(pushMock).toHaveBeenCalledWith('/review');
  });
});
