'use client';

import { useGetReservationDetailData } from '@/src/entities/reservation';
import { useGetUserData } from '@/src/entities/user';
import { useGetViewCountData } from '@/src/entities/viewCount';
import {
  ReservationManageDialog,
  SecretPostAccessDenied,
  SecretPostLoginGate,
  SecretPostPasswordGate,
  useReservationDetailActions,
} from '@/src/feature/reservation-detail';
import { useScreenView } from '@/src/shared/hooks/useScreenView';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { ReservationCommentForm, ReservationCommentList, ReservationDetailContent } from '@/src/widgets/reservation';

type TReservationDetailPageProps = { docId: string };

export const ReservationDetailPage = ({ docId }: TReservationDetailPageProps) => {
  const { data } = useGetReservationDetailData(docId);
  const { data: userData } = useGetUserData();
  const { data: viewCountData } = useGetViewCountData(docId);
  const isAdmin = userData.userData?.grade === 'admin';
  const isOwner = data.data.userId ? data.data.userId === userData.userData?.userId : true;
  const actions = useReservationDetailActions({
    docId,
    isGuestPost: data.data.userId == null,
    isPinned: data.data.isPinned,
    userId: data.data.userId,
  });

  useScreenView(`reservation_detail_${docId}`, 'ReservationDetailPage', { doc_id: docId });

  if (data.response === 'ng') {
    if (data.code === 'NEEDS_PASSWORD') return <SecretPostPasswordGate docId={docId} />;
    if (data.code === 'NEEDS_LOGIN') return <SecretPostLoginGate docId={docId} />;
    if (data.code === 'ACCESS_DENIED') return <SecretPostAccessDenied />;
    throw new Error(data.message);
  }

  return (
    <>
      {actions.isEditNavigating ? <LoadingSpinnerOverlay text={actions.editLoadingText} /> : null}
      <ReservationDetailContent
        isAdmin={isAdmin}
        isOwner={isOwner}
        isPinToggling={actions.isPinToggling}
        reservationDetailData={data.data}
        viewCountData={viewCountData.data}
        onDelete={actions.handleDelete}
        onEdit={actions.handleEdit}
        onTogglePin={actions.handleTogglePin}
      />
      <ReservationCommentForm docId={docId} />
      <ReservationCommentList docId={docId} userId={userData.userData?.userId} />
      <ReservationManageDialog {...actions} />
    </>
  );
};
