export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { SearchParams } from 'nuqs/server';

import { getReservationListData } from '@/src/entities/reservation';
import { reservationKeys } from '@/src/shared/config/queryKeys';
import { loadReservationParams } from '@/src/shared/lib/nuqs/searchParams';

import { ReservationListPage } from './ui/ReservationListPage';

type TPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: TPageProps) {
  const { page, hideSecret } = await loadReservationParams(searchParams);
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: reservationKeys.list({ page, hideSecret }),
    queryFn: () => getReservationListData({ page, hideSecret }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReservationListPage />
    </HydrationBoundary>
  );
}
