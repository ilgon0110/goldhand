import { getReservationDetailData } from '@/src/entities/reservation';
import { getUserData } from '@/src/shared/api/getUserData';
import { getViewCountData } from '@/src/shared/api/getViewCountData';

import { ReservationDetailPage } from './ui/ReservationDetailPage';

type TPageProps = {
  params: Promise<{ docId: string }>;
  searchParams: Promise<{ password: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { docId } = await params;

  const data = await getReservationDetailData({
    docId,
  });
  const userData = await getUserData();
  const viewCountData = await getViewCountData({ docId });

  if (data.message === 'Error getting document') {
    throw new Error('Error getting document');
  }

  return <ReservationDetailPage data={data} docId={docId} userData={userData} viewCountData={viewCountData} />;
}
