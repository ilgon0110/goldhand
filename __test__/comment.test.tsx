import { Timestamp } from '@firebase/firestore';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as utils from '@/src/shared/utils';
import { Comment } from '@/src/widgets/Comment';

vi.mock('@/src/shared/utils', async () => {
  // 원본 모듈 import
  const actual = await vi.importActual('@/src/shared/utils');
  return {
    ...actual,
    toastError: vi.fn(), // toastError만 mock
  };
});

type TComment = {
  id: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  comment: string;
};

const mockCommentData: TComment[] = [
  {
    id: 'commentId',
    userId: 'userId',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    comment: 'This is a test comment',
  },
];

describe('Comment 컴포넌트 테스트', () => {
  it('렌더링 테스트', () => {
    for (const comment of mockCommentData) {
      render(
        <Comment
          commentId={comment.id}
          content={comment.comment}
          createdAt={comment.createdAt}
          docId="docId"
          isCommentOwner={comment.userId === 'userId'}
          mutateDeleteComment={async _id => {}}
          mutateUpdateComment={async (_id, _content) => {}}
          updatedAt={comment.updatedAt}
        />,
      );
      expect(screen.getByText('This is a test comment')).toBeInTheDocument();
    }
  });

  it('isCommentOwner가 true일 때 수정, 삭제 버튼이 보인다.', () => {
    for (const comment of mockCommentData) {
      render(
        <Comment
          commentId={comment.id}
          content={comment.comment}
          createdAt={comment.createdAt}
          docId="docId"
          isCommentOwner={comment.userId === 'userId'}
          mutateDeleteComment={async _id => {}}
          mutateUpdateComment={async (_id, _content) => {}}
          updatedAt={comment.updatedAt}
        />,
      );

      expect(screen.getByTestId('edit-button')).toBeInTheDocument();
      expect(screen.getByTestId('delete-button')).toBeInTheDocument();
    }
  });

  it('isCommentOwner가 false일 때 수정, 삭제 버튼이 보이지 않는다.', () => {
    for (const comment of mockCommentData) {
      render(
        <Comment
          commentId={comment.id}
          content={comment.comment}
          createdAt={comment.createdAt}
          docId="docId"
          isCommentOwner={comment.userId === 'differentUserId'}
          mutateDeleteComment={async _id => {}}
          mutateUpdateComment={async (_id, _content) => {}}
          updatedAt={comment.updatedAt}
        />,
      );

      expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
    }
  });

  it('수정 버튼을 눌렀을 때 수정 모드로 변경된다.', async () => {
    for (const comment of mockCommentData) {
      render(
        <Comment
          commentId={comment.id}
          content={comment.comment}
          createdAt={comment.createdAt}
          docId="docId"
          isCommentOwner={comment.userId === 'userId'}
          mutateDeleteComment={async _id => {}}
          mutateUpdateComment={async (_id, _content) => {}}
          updatedAt={comment.updatedAt}
        />,
      );

      await userEvent.click(screen.getByTestId('edit-button'));
      expect(screen.getByRole('button', { name: '수정완료' })).toBeInTheDocument();
    }
  });

  it('수정 모드에서 취소 버튼을 눌렀을 때 수정 모드가 해제된다.', async () => {
    for (const comment of mockCommentData) {
      render(
        <Comment
          commentId={comment.id}
          content={comment.comment}
          createdAt={comment.createdAt}
          docId="docId"
          isCommentOwner={comment.userId === 'userId'}
          mutateDeleteComment={async _id => {}}
          mutateUpdateComment={async (_id, _content) => {}}
          updatedAt={comment.updatedAt}
        />,
      );

      await userEvent.click(screen.getByTestId('edit-button'));
      expect(screen.getByRole('button', { name: '수정완료' })).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: '취소' }));
      expect(screen.queryByRole('button', { name: '수정완료' })).not.toBeInTheDocument();
    }
  });

  it('수정 모드에서 내용을 수정하고 제출 버튼을 눌렀을 때 mutateUpdateComment가 호출된다.', async () => {
    for (const comment of mockCommentData) {
      const mutateUpdateCommentMock = vi.fn(async (_id: string, _content: string) => {});

      render(
        <Comment
          commentId={comment.id}
          content={comment.comment}
          createdAt={comment.createdAt}
          docId="docId"
          isCommentOwner={comment.userId === 'userId'}
          mutateDeleteComment={async _id => {}}
          mutateUpdateComment={mutateUpdateCommentMock}
          updatedAt={comment.updatedAt}
        />,
      );

      await userEvent.click(screen.getByTestId('edit-button'));
      expect(screen.getByRole('button', { name: '수정완료' })).toBeInTheDocument();

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      await userEvent.clear(textarea);
      await userEvent.type(textarea, 'This is an edited comment');

      await userEvent.click(screen.getByRole('button', { name: '수정완료' }));
      expect(mutateUpdateCommentMock).toHaveBeenCalledWith(comment.id, 'This is an edited comment');
    }
  });

  it('수정 모드에서 내용을 수정하고 제출 버튼을 눌렀을 때, mutateUpdateComment가 실패하면 에러 메시지가 표시된다.', async () => {
    for (const comment of mockCommentData) {
      const mutateUpdateCommentMock = vi.fn(async (_id: string, _content: string) => {
        throw new Error('Failed to update comment');
      });

      render(
        <Comment
          commentId={comment.id}
          content={comment.comment}
          createdAt={comment.createdAt}
          docId="docId"
          isCommentOwner={comment.userId === 'userId'}
          mutateDeleteComment={async _id => {}}
          mutateUpdateComment={mutateUpdateCommentMock}
          updatedAt={comment.updatedAt}
        />,
      );

      await userEvent.click(screen.getByTestId('edit-button'));
      expect(screen.getByRole('button', { name: '수정완료' })).toBeInTheDocument();

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
      await userEvent.clear(textarea);
      await userEvent.type(textarea, 'This is an edited comment');

      await userEvent.click(screen.getByRole('button', { name: '수정완료' }));
      expect(mutateUpdateCommentMock).toHaveBeenCalledWith(comment.id, 'This is an edited comment');

      // 에러 메시지가 표시되는지 확인
      expect(utils.toastError).toHaveBeenCalledWith('댓글 수정 중 알 수 없는 오류가 발생하였습니다.');
    }
  });

  it('삭제 버튼을 눌렀을 때 확인 모달이 뜨고, 취소를 누르면 모달이 닫힌다.', async () => {
    for (const comment of mockCommentData) {
      render(
        <Comment
          commentId={comment.id}
          content={comment.comment}
          createdAt={comment.createdAt}
          docId="docId"
          isCommentOwner={comment.userId === 'userId'}
          mutateDeleteComment={async _id => {}}
          mutateUpdateComment={async (_id, _content) => {}}
          updatedAt={comment.updatedAt}
        />,
      );

      await userEvent.click(screen.getByTestId('delete-button'));
      expect(screen.getByText('댓글을 삭제하시겠습니까?')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: '취소하기' }));
      expect(screen.queryByText('댓글을 삭제하시겠습니까?')).not.toBeInTheDocument();
    }
  });

  it('삭제 버튼을 눌렀을 때 확인 모달이 뜨고, 확인을 누르면 mutateDeleteComment가 호출된다.', async () => {
    for (const comment of mockCommentData) {
      const mutateDeleteCommentMock = vi.fn(async (_id: string) => {});

      render(
        <Comment
          commentId={comment.id}
          content={comment.comment}
          createdAt={comment.createdAt}
          docId="docId"
          isCommentOwner={comment.userId === 'userId'}
          mutateDeleteComment={mutateDeleteCommentMock}
          mutateUpdateComment={async (_id, _content) => {}}
          updatedAt={comment.updatedAt}
        />,
      );

      await userEvent.click(screen.getByTestId('delete-button'));
      expect(screen.getByText('댓글을 삭제하시겠습니까?')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));
      expect(mutateDeleteCommentMock).toHaveBeenCalledWith(comment.id);
    }
  });

  it('삭제 버튼을 눌렀을 때 확인 모달이 뜨고, 확인을 누르면 mutateDeleteComment가 실패하면 에러 메시지가 표시된다.', async () => {
    for (const comment of mockCommentData) {
      const mutateDeleteCommentMock = vi.fn(async (_id: string) => {
        throw new Error('Failed to delete comment');
      });

      render(
        <Comment
          commentId={comment.id}
          content={comment.comment}
          createdAt={comment.createdAt}
          docId="docId"
          isCommentOwner={comment.userId === 'userId'}
          mutateDeleteComment={mutateDeleteCommentMock}
          mutateUpdateComment={async (_id, _content) => {}}
          updatedAt={comment.updatedAt}
        />,
      );

      await userEvent.click(screen.getByTestId('delete-button'));
      expect(screen.getByText('댓글을 삭제하시겠습니까?')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: '삭제하기' }));
      expect(mutateDeleteCommentMock).toHaveBeenCalledWith(comment.id);

      // 에러 메시지가 표시되는지 확인
      expect(utils.toastError).toHaveBeenCalledWith('Failed to delete comment');
    }
  });
});
