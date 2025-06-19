import { Suspense } from 'react';

import { getUserData } from '@/src/shared/api/getUserData';
import LoadingBar from '@/src/shared/ui/loadingBar';
import { getConsultDetailData, ReservationDetailPage } from '@/src/views/reservation';

type TPageProps = {
  params: { docId: string };
  searchParams: { password: string };
};

export default async function Page({ params, searchParams }: TPageProps) {
  const { docId } = params;
  const { password } = searchParams;
  const userData = await getUserData();
  const data = await getConsultDetailData({
    docId,
    password,
    userId: userData.userData?.uid || null,
  });

  if (data.message === 'Error getting document') {
    throw new Error('Error getting document');
  }

  return (
    <Suspense fallback={<LoadingBar />}>
      <ReservationDetailPage data={data} docId={docId} userData={userData} />
    </Suspense>
  );
}
