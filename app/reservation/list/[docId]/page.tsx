import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { getReservationDetailData } from '@/src/entities/reservation';
import { getUserData } from '@/src/shared/api/getUserData';
import { getViewCountData } from '@/src/shared/api/getViewCountData';
import { reservationKeys, userKeys, viewCountKeys } from '@/src/shared/config/queryKeys';

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

  if (reservationData.message === 'TOKEN_EXPIRED') {
    redirect('/reservation/list');
  }

  if (reservationData.message === 'Error getting document') {
    throw new Error('Error getting document');
  }

  await Promise.all([
    queryClient.prefetchQuery({ queryKey: userKeys.all, queryFn: getUserData }),
    queryClient.prefetchQuery({
      queryKey: viewCountKeys.detail(docId),
      queryFn: () => getViewCountData({ docId }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReservationDetailPage docId={docId} />
    </HydrationBoundary>
  );
}
