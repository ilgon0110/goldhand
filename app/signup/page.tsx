import { Suspense } from 'react';

import { getUserData } from '@/src/shared/api/getUserData';
import LoadingBar from '@/src/shared/ui/loadingBar';
import { SignupPage } from '@/src/views/signup';

export default async function Page() {
  const data = await getUserData();
  return (
    <Suspense fallback={<LoadingBar />}>
      <SignupPage userData={data.userData} />
    </Suspense>
  );
}
