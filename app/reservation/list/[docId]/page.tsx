import { Suspense } from 'react';

import { getUserData } from '@/src/shared/api/getUserData';
import LoadingBar from '@/src/shared/ui/loadingBar';
import { getConsultDetailData, ReservationDetailPage } from '@/src/views/reservation';

type TPageProps = {
  params: { docId: string };
  searchParams: { password: string };
};

export default async function Page({ params }: TPageProps) {
  const { docId } = params;

  const data = await getConsultDetailData({
    docId,
  });
  const userData = await getUserData();

  if (data.message === 'Error getting document') {
    throw new Error('Error getting document');
  }

  return (
    <Suspense fallback={<LoadingBar />}>
      <ReservationDetailPage data={data} docId={docId} userData={userData} />
    </Suspense>
  );
}
