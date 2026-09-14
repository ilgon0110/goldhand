'use client';

import { useGetReviewDetailData } from '@/src/entities/review';
import { useGetUserData } from '@/src/entities/user';
import { useGetViewCountData } from '@/src/entities/viewCount';
import {
  ReviewDeleteDialog,
  useReviewComment,
  useReviewDeleteFlow,
  useReviewDetailActions,
} from '@/src/feature/review-detail';
import { useScreenView } from '@/src/shared/hooks/useScreenView';
import { MyAlertDialog } from '@/src/shared/ui/MyAlertDialog';
import { Editor } from '@/src/widgets/editor/ui/Editor';
import { ReviewCommentSection, ReviewDetailContent } from '@/src/widgets/review';

type TReviewDetailPageProps = { docId: string };
const handleEditorChange = () => {};

export const ReviewDetailPage = ({ docId }: TReviewDetailPageProps) => {
  const { data } = useGetReviewDetailData(docId);
  const { data: userData } = useGetUserData();
  const { data: viewCountData } = useGetViewCountData(docId);
  const userId = userData.userData?.userId;
  const isAdmin = userData.userData?.grade === 'admin';
  const actions = useReviewDetailActions({
    docId,
    isAdmin,
    isPinned: data.data.isPinned,
    postUserId: data.data.userId,
    userId,
  });
  const deleteFlow = useReviewDeleteFlow({
    docId,
    requiresPhoneAuth: data.data.userId == null && !isAdmin,
  });
  const comment = useReviewComment(docId);
  const { handleEditConfirm: onEditConfirm, handleUpdateDialogOpenChange: onUpdateDialogOpenChange } = actions;

  useScreenView(`review_detail_${docId}`, 'ReviewDetailPage', { doc_id: docId });

  return (
    <>
      <ReviewDetailContent
        canManage={actions.canManage}
        data={data.data}
        isAdmin={isAdmin}
        isPinToggling={actions.isPinToggling}
        viewCountData={viewCountData.data}
        onDelete={deleteFlow.handleOpen}
        onEdit={actions.handleEdit}
        onTogglePin={actions.handleTogglePin}
      >
        <Editor editable={false} htmlString={data.data.htmlString} onEditorChange={handleEditorChange} />
      </ReviewDetailContent>
      <ReviewCommentSection docId={docId} userId={userId} {...comment} />
      <MyAlertDialog
        description="게시글 수정 화면으로 이동하시겠습니까?"
        handleDeletePostClick={onEditConfirm}
        isPending={false}
        okButtonText="수정하기"
        opOpenChange={onUpdateDialogOpenChange}
        open={actions.isUpdateDialogOpen}
        title="게시글 수정"
      />
      <ReviewDeleteDialog {...deleteFlow} />
    </>
  );
};
