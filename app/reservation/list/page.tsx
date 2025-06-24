import type { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

import { loadConsultParams } from '@/src/shared/searchParams';
import LoadingBar from '@/src/shared/ui/loadingBar';
import { getReservationListData, ReservationListPage } from '@/src/views/reservation';

type TPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: TPageProps) {
  const { page, hideSecret } = await loadConsultParams(searchParams);
  const data = await getReservationListData({
    page,
    hideSecret,
  });

  console.log('Reservation List Data:', data);

  return (
    <Suspense fallback={<LoadingBar />}>
      <ReservationListPage data={data} />
    </Suspense>
  );
}
