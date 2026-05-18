'use client';

import type { IApplyDetailData } from '@/src/shared/types';

interface IManagerApplyDetailPageProps {
  managerApplyDetailData: IApplyDetailData | null;
  userId: string;
}

import { ManagerCommentForm, ManagerCommentList, ManagerDetailContent } from '@/src/widgets/managers';

export const ManagerApplyDetailPage = ({ managerApplyDetailData, userId }: IManagerApplyDetailPageProps) => {
  if (managerApplyDetailData == null) {
    throw new Error('지원서 정보를 불러오는 데 실패했습니다.');
  }

  return (
    <>
      {/* 지원서 내용 */}
      <ManagerDetailContent managerApplyDetailData={managerApplyDetailData} />

      {/* 댓글 입력란 */}
      <ManagerCommentForm docId={managerApplyDetailData.docId} />

      {/* 댓글들 */}
      <ManagerCommentList docId={managerApplyDetailData.docId} userId={userId} />
    </>
  );
};
