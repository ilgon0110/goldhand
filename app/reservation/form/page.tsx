import { Suspense } from 'react';

import { getUserData } from '@/src/shared/api/getUserData';
import LoadingBar from '@/src/shared/ui/loadingBar';
import { ReservationRecaptchaProvider } from '@/src/views/reservation/form';

export default async function Page() {
  const userData = await getUserData();

  return (
    <Suspense fallback={<LoadingBar />}>
      <ReservationRecaptchaProvider userData={userData} />
    </Suspense>
  );
}
