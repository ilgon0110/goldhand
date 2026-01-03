'use client';

import { Comment, useComments } from '@/src/entities/comment';
import { Label } from '@/src/shared/ui/label';

type TReservationCommentListProps = {
  docId: string;
  userId: string | undefined;
};

export const ReservationCommentList = ({ docId, userId }: TReservationCommentListProps) => {
  const { comments } = useComments({
    docId,
    collectionName: 'consults',
  });

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
              type="reservation"
              updatedAt={item.updatedAt}
              userId={userId || ''}
            />
          );
        })}
      </div>
    </>
  );
};
