import type { ReactNode } from 'react';

import { PinToggleButton } from '@/src/entities/pin';
import type { IReviewDetailData, IViewCountData } from '@/src/shared/types';
import { Button } from '@/src/shared/ui/button';
import { PostDetailHeader } from '@/src/feature/post/ui/PostDetailHeader';
import { formatPhoneNumber } from '@/src/shared/utils';

type TReviewDetailContentProps = {
  canManage: boolean;
  children: ReactNode;
  data: IReviewDetailData;
  isAdmin: boolean;
  isPinToggling: boolean;
  viewCountData: IViewCountData | null;
  onDelete: () => void;
  onEdit: () => void;
  onTogglePin: () => void;
};

export function ReviewDetailContent({
  canManage,
  children,
  data,
  isAdmin,
  isPinToggling,
  viewCountData,
  onDelete: handleDelete,
  onEdit: handleEdit,
  onTogglePin: handleTogglePin,
}: TReviewDetailContentProps) {
  return (
    <>
      <PostDetailHeader
        author={data.name}
        badge={data.franchisee}
        createdAt={data.createdAt}
        phoneNumber={isAdmin && data.phoneNumber ? formatPhoneNumber(data.phoneNumber) : undefined}
        pin={
          <PinToggleButton
            isAdmin={isAdmin}
            isLoading={isPinToggling}
            isPinned={data.isPinned}
            onToggle={handleTogglePin}
          />
        }
        title={data.title}
        updatedAt={data.updatedAt}
        viewCount={viewCountData?.totalViewCount || 0}
      />
      <div className="my-4 h-[1px] w-full bg-slate-300" />
      <div className="relative w-full">
        <div className="mb-4 flex flex-col gap-1">
          <span className="text-xl font-bold">후기</span>
          {children}
        </div>
      </div>
      <div className="mb-4 mt-4 h-[1px] w-full bg-slate-300" />
      {canManage ? (
        <div className="flex w-full justify-end space-x-4">
          <Button
            className="border border-primary bg-transparent text-primary transition-all duration-300 hover:bg-primary hover:text-white"
            onClick={handleEdit}
          >
            수정하기
          </Button>
          <Button variant="destructive" onClick={handleDelete}>삭제하기</Button>
        </div>
      ) : null}
    </>
  );
}
