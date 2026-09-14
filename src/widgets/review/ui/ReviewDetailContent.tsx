import type { ReactNode } from 'react';

import { PinToggleButton } from '@/src/entities/pin';
import type { IReviewDetailData, IViewCountData } from '@/src/shared/types';
import { Button } from '@/src/shared/ui/button';
import { ViewIcon } from '@/src/shared/ui/icons/ViewIcon';
import { formatDateToYMD } from '@/src/shared/utils';

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
      <div className="relative flex flex-col gap-2">
        <h3 className="text-xl font-bold md:text-3xl">{data.title}</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-wrap items-center gap-x-2">
            <span className="text-slate-500">{data.franchisee}</span>
            <span>{data.name}</span>
            <span><span className="font-bold">작성일:</span> {formatDateToYMD(data.createdAt)}</span>
            <span><span className="font-bold">수정일:</span> {formatDateToYMD(data.updatedAt)}</span>
            {isAdmin && data.phoneNumber ? (
              <span className="whitespace-nowrap text-slate-500">
                <span className="font-bold">연락처:</span> {data.phoneNumber}
              </span>
            ) : null}
          </div>
          <div className="flex flex-row items-center gap-2 text-slate-500 sm:ml-auto">
            <ViewIcon />
            <span>{viewCountData?.totalViewCount || 0}회</span>
          </div>
        </div>
      </div>
      <div className="my-4 h-[1px] w-full bg-slate-300" />
      <div className="relative w-full">
        <div className="mb-4 flex flex-col gap-1">
          <span className="text-xl font-bold">후기</span>
          {children}
        </div>
      </div>
      <div className="mb-4 mt-4 h-[1px] w-full bg-slate-300" />
      <PinToggleButton
        isAdmin={isAdmin}
        isLoading={isPinToggling}
        isPinned={data.isPinned}
        onToggle={handleTogglePin}
      />
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
