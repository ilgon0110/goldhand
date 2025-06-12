import { Suspense } from 'react';

import LoadingBar from '@/src/shared/ui/loadingBar';
import { MyPageEditPage } from '@/src/views/mypage';
import { getUserData } from '@/src/views/signup';

export default async function Page() {
  const data = await getUserData();

  return (
    <Suspense fallback={<LoadingBar />}>
      <MyPageEditPage userData={data} />
    </Suspense>
  );
}
