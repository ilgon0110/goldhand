import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { getReservationDetailData } from '@/src/entities/reservation';
import { getUserData } from '@/src/shared/api/getUserData';
import { reservationKeys, userKeys } from '@/src/shared/config/queryKeys';

import { ReservationDetailPage } from './ui/ReservationDetailPage';

type TPageProps = {
  params: Promise<{ docId: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { docId } = await params;
  const queryClient = new QueryClient();

  const reservationData = await queryClient.fetchQuery({
    queryKey: reservationKeys.detail(docId),
    queryFn: () => getReservationDetailData({ docId }),
  });

  if (reservationData.code === 'TOKEN_EXPIRED') {
    redirect('/reservation/list');
  }

  if (reservationData.code === 'SERVER_ERROR') {
    throw new Error('Error getting document');
  }

  await queryClient.prefetchQuery({ queryKey: userKeys.all, queryFn: getUserData });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReservationDetailPage docId={docId} />
    </HydrationBoundary>
  );
}
