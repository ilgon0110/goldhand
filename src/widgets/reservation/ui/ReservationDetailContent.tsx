import { PinToggleButton } from '@/src/entities/pin';
import type { IReservationDetailData, IViewCountData } from '@/src/shared/types';
import { Button } from '@/src/shared/ui/button';
import { PostDetailHeader } from '@/src/feature/post/ui/PostDetailHeader';
import { formatPhoneNumber } from '@/src/shared/utils';

type TReservationDetailContentProps = {
  reservationDetailData: IReservationDetailData;
  viewCountData: IViewCountData | null;
  isOwner: boolean;
  isAdmin: boolean;
  isPinToggling: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onTogglePin: () => void;
};

export const ReservationDetailContent = ({
  reservationDetailData,
  viewCountData,
  isOwner,
  isAdmin,
  isPinToggling,
  onDelete: handleDelete,
  onEdit: handleEdit,
  onTogglePin: handleTogglePin,
}: TReservationDetailContentProps) => {
  const author = reservationDetailData.name;
  // 비회원 글은 userId가 없어 isOwner가 항상 true이므로(수정/삭제 시 비밀번호로 검증),
  // 작성자 정보(이름/연락처)는 실제 회원 본인이거나 관리자인 경우에만 노출한다.
  const canViewAuthorInfo = (Boolean(reservationDetailData.userId) && isOwner) || isAdmin;

  const formatToYYYYMMDD = (dateInput: string | Date): string => {
    const date = new Date(dateInput);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 0-based
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  return (
    <>
      <PostDetailHeader
        author={canViewAuthorInfo ? author : undefined}
        badge={reservationDetailData.franchisee}
        createdAt={reservationDetailData.createdAt}
        phoneNumber={canViewAuthorInfo ? formatPhoneNumber(reservationDetailData.phoneNumber) : undefined}
        pin={
          <PinToggleButton
            isAdmin={isAdmin}
            isLoading={isPinToggling}
            isPinned={reservationDetailData.isPinned}
            onToggle={handleTogglePin}
          />
        }
        title={reservationDetailData.title}
        updatedAt={reservationDetailData.updatedAt}
        viewCount={viewCountData?.totalViewCount ?? 0}
      />
      <div className="my-4 h-[1px] w-full bg-slate-300" />
      <div className="relative w-full">
        <div className="relative mb-4 flex flex-col gap-1">
          <span className="text-xl font-bold">출산 예정일</span>
          <span className="text-slate-500">
            {reservationDetailData.bornDate ? formatToYYYYMMDD(reservationDetailData.bornDate) : '없음'}
          </span>
        </div>
        <div className="mb-4 flex flex-col gap-1">
          <span className="text-xl font-bold">상담내용</span>
          <p className="whitespace-pre-wrap break-words">{reservationDetailData.content}</p>
        </div>
      </div>
      <div className="mb-4 mt-4 h-[1px] w-full bg-slate-300" />
      {isOwner && (
        <div className="flex w-full justify-end space-x-4">
          <Button
            className="border border-primary bg-transparent text-primary transition-all duration-300 hover:bg-primary hover:text-white"
            onClick={handleEdit}
          >
            수정하기
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            삭제하기
          </Button>
        </div>
      )}
    </>
  );
};
