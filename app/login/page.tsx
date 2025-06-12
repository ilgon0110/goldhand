import { Suspense } from 'react';

import LoadingBar from '@/src/shared/ui/loadingBar';
import { getLoginData, LoginPage } from '@/src/views/login';

export default async function Page({ searchParams }: { searchParams?: { [key: string]: string } }) {
  const loginData = await getLoginData('naver');

  return (
    <Suspense fallback={<LoadingBar />}>
      <LoginPage data={loginData} />
    </Suspense>
  );
}
