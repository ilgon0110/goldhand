'use client';

import { Label } from '@/src/shared/ui/label';
import { Comment, useComments } from '@/src/widgets/Comment';

type TReservationCommentListProps = {
  docId: string;
  userId: string | undefined;
};

export const ReservationCommentList = ({ docId, userId }: TReservationCommentListProps) => {
  const { comments } = useComments({
    docId,
    collectionName: 'consults',
  });

  const mutateDeleteComment = async (commentId: string) => {
    return await fetch('/api/consultDetail/comment/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        docId,
        commentId,
      }),
    });
  };

  const mutateUpdateComment = async (commentId: string, comment: string) => {
    return await fetch('/api/consultDetail/comment/update', {
      method: 'POST',
      body: JSON.stringify({
        docId,
        commentId,
        comment,
      }),
    });
  };

  return (
    <>
      <Label className="mt-10 text-lg font-bold">{`댓글 (${
        comments != null ? comments.length : '댓글이 없습니다'
      })`}</Label>
      <div className="mt-2 space-y-4">
        {comments?.map(item => {
          return (
            <Comment
              commentId={item.id}
              content={item.comment}
              createdAt={item.createdAt}
              docId={docId}
              isCommentOwner={item.userId === userId}
              key={item.id}
              mutateDeleteComment={mutateDeleteComment}
              mutateUpdateComment={mutateUpdateComment}
              updatedAt={item.updatedAt}
            />
          );
        })}
      </div>
    </>
  );
};
