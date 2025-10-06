export const dynamic = 'force-dynamic';

import type { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

import { loadReservationParams } from '@/src/shared/lib/nuqs/searchParams';
import LoadingBar from '@/src/shared/ui/loadingBar';
import { getReservationListData, ReservationListPage } from '@/src/views/reservation';

type TPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: TPageProps) {
  const { page, hideSecret } = await loadReservationParams(searchParams);
  const data = await getReservationListData({
    page,
    hideSecret,
  });

  return (
    <Suspense fallback={<LoadingBar />}>
      <ReservationListPage data={data} />
    </Suspense>
  );
}
