import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { PinToggleButton, usePinMutation } from '@/src/entities/pin';
import type { IReservationDetailData, IViewCountData } from '@/src/shared/types';
import { Button } from '@/src/shared/ui/button';
import { ViewIcon } from '@/src/shared/ui/icons/ViewIcon';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { formatDateToYMD, formatPhoneNumber } from '@/src/shared/utils';

type TReservationDetailContentProps = {
  docId: string;
  reservationDetailData: IReservationDetailData;
  viewCountData: IViewCountData | null;
  isOwner: boolean;
  isAdmin: boolean;
  onChangeDialogOpen: (open: boolean) => void;
  onChangeUpdateButtonName: (name: 'DELETE' | 'EDIT') => void;
  onChangeAlertDialogOpen: (open: boolean) => void;
};

export const ReservationDetailContent = ({
  docId,
  reservationDetailData,
  viewCountData,
  isOwner,
  isAdmin,
  onChangeDialogOpen,
  onChangeUpdateButtonName,
  onChangeAlertDialogOpen,
}: TReservationDetailContentProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const author = reservationDetailData.name;
  const isGuestPost = !reservationDetailData.userId;
  // 비회원 글은 userId가 없어 isOwner가 항상 true이므로(수정/삭제 시 비밀번호로 검증),
  // 작성자 정보(이름/연락처)는 실제 회원 본인이거나 관리자인 경우에만 노출한다.
  const canViewAuthorInfo = (Boolean(reservationDetailData.userId) && isOwner) || isAdmin;
  const { mutate: togglePin, isPending: isPinToggling } = usePinMutation('reservation');

  const formatToYYYYMMDD = (dateInput: string | Date): string => {
    const date = new Date(dateInput);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 0-based
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // 비회원의 경우 비밀번호 검증
    e.stopPropagation();
    onChangeUpdateButtonName('EDIT');
    if (isGuestPost) {
      onChangeDialogOpen(true);
    } else {
      // 수정 Form으로 이동
      startTransition(() => {
        router.push(`/reservation/edit?docId=${docId}`);
      });
    }
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // 비회원의 경우 비밀번호 검증
    e.stopPropagation();
    onChangeUpdateButtonName('DELETE');
    if (isGuestPost) {
      onChangeDialogOpen(true);
    } else {
      // 삭제 Modal 호출
      onChangeAlertDialogOpen(true);
    }
  };

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="페이지 이동중.." />}
      <div className="relative flex flex-col gap-2">
        <h3 className="text-xl font-bold md:text-3xl">{reservationDetailData.title}</h3>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <span className="whitespace-nowrap text-slate-500">
              <span className="font-bold">지점:</span> {reservationDetailData.franchisee}
            </span>
            {canViewAuthorInfo && (
              <span className="whitespace-nowrap">
                <span className="font-bold">작성자:</span> {author}
              </span>
            )}
            {canViewAuthorInfo && (
              <span className="whitespace-nowrap">
                <span className="font-bold">연락처:</span> {formatPhoneNumber(reservationDetailData.phoneNumber)}
              </span>
            )}
            <span className="whitespace-nowrap">
              <span className="font-bold">작성일:</span> {formatDateToYMD(reservationDetailData.createdAt)}
            </span>
          </div>
          <div className="flex flex-row items-center gap-1 text-slate-500 sm:ml-auto">
            <ViewIcon />
            <span>{viewCountData?.totalViewCount}회</span>
          </div>
        </div>
      </div>
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
          <p>{reservationDetailData.content}</p>
        </div>
      </div>
      <div className="mb-4 mt-4 h-[1px] w-full bg-slate-300" />
      <PinToggleButton
        isAdmin={isAdmin}
        isLoading={isPinToggling}
        isPinned={reservationDetailData.isPinned}
        onToggle={() => togglePin({ docId, isPinned: !reservationDetailData.isPinned })}
      />
      {isOwner && (
        <div className="flex w-full justify-end space-x-4">
          <Button
            className="border border-primary bg-transparent text-primary transition-all duration-300 hover:bg-primary hover:text-white"
            onClick={e => handleEditClick(e)}
          >
            수정하기
          </Button>
          <Button variant="destructive" onClick={e => handleDeleteClick(e)}>
            삭제하기
          </Button>
        </div>
      )}
    </>
  );
};
