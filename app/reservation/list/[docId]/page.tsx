import { Suspense } from 'react';

import LoadingBar from '@/src/shared/ui/loadingBar';
import { getConsultDetailData, ReservationDetailPage } from '@/src/views/reservation';
import { getUserData } from '@/src/views/signup';

type TPageProps = {
  params: { docId: string };
  searchParams: { password: string };
};

export default async function Page({ params, searchParams }: TPageProps) {
  const { docId } = params;
  const { password } = searchParams;
  const data = await getConsultDetailData({
    docId,
    password,
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
