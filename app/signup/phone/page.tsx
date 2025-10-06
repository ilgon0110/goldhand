import { Suspense } from 'react';

import { getUserData } from '@/src/shared/api/getUserData';
import LoadingBar from '@/src/shared/ui/loadingBar';
import { SignupPhonePage } from '@/src/widgets/SignupPhone';

export default async function Page() {
  const data = await getUserData();
  return (
    <Suspense fallback={<LoadingBar />}>
      <SignupPhonePage userData={data.userData} />
    </Suspense>
  );
}
