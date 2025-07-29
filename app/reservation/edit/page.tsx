import { Suspense } from 'react';

import { getUserData } from '@/src/shared/api/getUserData';
import LoadingBar from '@/src/shared/ui/loadingBar';
import { getConsultDetailData } from '@/src/views/reservation';
import { ReservationRecaptchaProvider } from '@/src/views/reservation';

type TPageProps = {
  params: { slug: string };
  searchParams: { docId: string | undefined; password: string | undefined };
};

export default async function Page({ params, searchParams }: TPageProps) {
  const userData = await getUserData();
  const consultDetailData = await getConsultDetailData({
    docId: searchParams.docId || '',
  });

  return (
    <Suspense fallback={<LoadingBar />}>
      <ReservationRecaptchaProvider consultDetailData={consultDetailData} userData={userData} />
    </Suspense>
  );
}
