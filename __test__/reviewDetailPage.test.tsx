import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { server } from '@/src/__mock__/node';
import type { IViewCountResponseData } from '@/src/shared/types';
import * as utils from '@/src/shared/utils';
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

vi.mock('@/src/shared/utils', async () => {
  // 원본 모듈 import
  const actual = await vi.importActual('@/src/shared/utils');
  return {
    ...actual,
    toastSuccess: vi.fn(),
    toastError: vi.fn(),
  };
});

const mockViewCountData: IViewCountResponseData = {
  response: 'ok',
  message: '성공',
  data: { totalViewCount: 100 },
};

describe('ReviewDetailPage 컴포넌트 테스트', () => {
  it('렌더링 테스트', async () => {
    const userData = await (await fetch('/api/user')).json();
    const reviewData = await (await fetch('/api/review/detail?docId=docId')).json();
    render(<ReviewDetailPage data={reviewData} docId="docId" userData={userData} viewCountData={mockViewCountData} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('수정하기 버튼을 눌렀을 때 확인 모달이 뜨고, 확인을 누르면 수정 페이지로 이동한다.', async () => {
    const userData = await (await fetch('/api/user')).json();
    const reviewData = await (await fetch('/api/review/detail?docId=docId')).json();
    render(<ReviewDetailPage data={reviewData} docId="docId" userData={userData} viewCountData={mockViewCountData} />);

    await userEvent.click(screen.getByRole('button', { name: '수정하기' }));
    expect(screen.getByText('게시글 수정')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '수정하기' }));
    expect(pushMock).toHaveBeenCalledWith('/review/docId/edit');
  });

  it('삭제하기 버튼을 눌렀을 때 확인 모달이 뜨고, 취소를 누르면 모달이 닫힌다.', async () => {
    const userData = await (await fetch('/api/user')).json();
    const reviewData = await (await fetch('/api/review/detail?docId=docId')).json();
    render(<ReviewDetailPage data={reviewData} docId="docId" userData={userData} viewCountData={mockViewCountData} />);

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));
    expect(screen.getByText('게시글을 삭제하시겠습니까?')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '취소하기' }));
    expect(screen.queryByText('삭제된 게시글은 복구할 수 없습니다.')).not.toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('삭제하기 버튼을 눌렀을 때 확인 모달이 뜨고, 확인을 누르면 삭제 요청이 보내진다.', async () => {
    const userData = await (await fetch('/api/user')).json();
    const reviewData = await (await fetch('/api/review/detail?docId=docId')).json();
    const handler = vi.fn(async ({ request }) => {
      const { docId, userId } = (await request.json()) as { docId: string; userId: string };
      if (docId !== 'docId' || userId !== userData.userData.userId) {
        return HttpResponse.json(
          {
            response: 'ng',
            message: '게시글 정보와 유저 정보가 일치하지 않습니다.',
          },
          { status: 400 },
        );
      }

      return HttpResponse.json({ response: 'ok', message: '삭제 성공' });
    });
    server.use(http.delete('/api/review/delete', handler));
    render(<ReviewDetailPage data={reviewData} docId="docId" userData={userData} viewCountData={mockViewCountData} />);

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));
    expect(screen.getByText('게시글을 삭제하시겠습니까?')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));

    //expect(handler).toHaveBeenCalledWith('/api/review/delete', expect.any(Object));
    await waitFor(async () => {
      expect(handler).toHaveBeenCalled();
      const req = handler.mock.calls as unknown as { request: Request }[][];
      const target = req[0][0];
      expect(target.request.url).toContain('/api/review/delete');
    });
  });

  it('게시글 삭제가 성공하면 리뷰 목록 페이지로 이동한다.', async () => {
    const userData = await (await fetch('/api/user')).json();
    const reviewData = await (await fetch('/api/review/detail?docId=docId')).json();
    const handler = vi.fn(async ({ request }) => {
      const { docId, userId } = (await request.json()) as { docId: string; userId: string };
      if (docId !== 'docId' || userId !== userData.userData.userId) {
        return HttpResponse.json(
          {
            response: 'ng',
            message: '게시글 정보와 유저 정보가 일치하지 않습니다.',
          },
          { status: 400 },
        );
      }

      return HttpResponse.json({ response: 'ok', message: '삭제 성공' });
    });
    server.use(http.delete('/api/review/delete', handler));
    render(<ReviewDetailPage data={reviewData} docId="docId" userData={userData} viewCountData={mockViewCountData} />);

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));
    expect(screen.getByText('게시글을 삭제하시겠습니까?')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));

    // 삭제가 성공하면 리뷰 목록 페이지로 이동
    // 모달이 닫히고 나서 push가 호출되므로, 약간의 딜레이를 줌
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(pushMock).toHaveBeenCalledWith('/review');
  });

  it('게시글 삭제가 실패하면 api의 에러 메시지가 표시된다.', async () => {
    const userData = await (await fetch('/api/user')).json();
    const reviewData = await (await fetch('/api/review/detail?docId=docId')).json();
    const handler = vi.fn(async () => {
      return HttpResponse.json(
        {
          response: 'ng',
          message: '게시글 정보와 유저 정보가 일치하지 않습니다.',
        },
        { status: 400 },
      );
    });
    server.use(http.delete('/api/review/delete', handler));
    render(<ReviewDetailPage data={reviewData} docId="docId" userData={userData} viewCountData={mockViewCountData} />);

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));
    expect(screen.getByText('게시글을 삭제하시겠습니까?')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));

    await waitFor(() => {
      expect(utils.toastError).toHaveBeenCalledWith(
        '게시글 삭제에 실패하였습니다.\n게시글 정보와 유저 정보가 일치하지 않습니다.',
      );
    });
  });
});
