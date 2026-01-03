'use client';

import { Comment, useComments } from '@/src/entities/comment';
import { Label } from '@/src/shared/ui/label';

type TManagerCommentListProps = {
  docId: string;
  userId: string | undefined;
};

export const ManagerCommentList = ({ docId, userId }: TManagerCommentListProps) => {
  const { comments } = useComments({
    docId,
    collectionName: 'managers',
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
              type="manager"
              updatedAt={item.updatedAt}
              userId={userId || ''}
            />
          );
        })}
      </div>
    </>
  );
};
