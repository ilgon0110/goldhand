import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import { GET as reservationDetailGET } from '@/app/api/reservation/detail/route';
import { routeGet } from '@/app/lib/routeGet';
import { makeQueryClient } from '@/src/app/providers/get-query-client';
import { reservationDetailQueryOptions } from '@/src/entities/reservation';

import { ReservationDetailPage } from './ui/ReservationDetailPage';

type TPageProps = {
  params: Promise<{ docId: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { docId } = await params;
  const queryClient = makeQueryClient();

  const reservationData = await queryClient.fetchQuery(
    reservationDetailQueryOptions(docId, routeGet(reservationDetailGET)),
  );

  if (reservationData.code === 'TOKEN_EXPIRED') {
    redirect('/reservation/list');
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReservationDetailPage docId={docId} />
    </HydrationBoundary>
  );
}
