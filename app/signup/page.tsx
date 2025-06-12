import { Suspense } from 'react';

import LoadingBar from '@/src/shared/ui/loadingBar';
import { getUserData, SignupPage } from '@/src/views/signup';

export default async function Page() {
  const userData = await getUserData();
  //const signUpData = await getSignUpData();

  return (
    <Suspense fallback={<LoadingBar />}>
      <SignupPage userData={userData} />
    </Suspense>
  );
}
