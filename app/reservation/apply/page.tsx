import { Suspense } from 'react';

import LoadingBar from '@/src/shared/ui/loadingBar';
import { ReservationApplyPage } from '@/src/views/reservation';

export default async function Page() {
  return (
    <Suspense fallback={<LoadingBar />}>
      <ReservationApplyPage />
    </Suspense>
  );
}
