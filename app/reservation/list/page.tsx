export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { SearchParams } from 'nuqs/server';

import { GET as reservationListGET } from '@/app/api/reservation/route';
import { routeGet } from '@/app/lib/routeGet';
import { reservationListQueryOptions } from '@/src/entities/reservation';
import { loadReservationParams } from '@/src/shared/lib/nuqs/searchParams';

import { ReservationListPage } from './ui/ReservationListPage';

type TPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: TPageProps) {
  const { page, hideSecret } = await loadReservationParams(searchParams);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(reservationListQueryOptions({ page, hideSecret }, routeGet(reservationListGET)));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReservationListPage />
    </HydrationBoundary>
  );
}
