export const dynamic = 'force-dynamic';

import type { SearchParams } from 'nuqs/server';

import { getReservationListData } from '@/src/entities/reservation';
import { loadReservationParams } from '@/src/shared/lib/nuqs/searchParams';

import { ReservationListPage } from './ui/ReservationListPage';

type TPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: TPageProps) {
  const { page, hideSecret } = await loadReservationParams(searchParams);
  const data = await getReservationListData({
    page,
    hideSecret,
  });

  return <ReservationListPage data={data} />;
}
