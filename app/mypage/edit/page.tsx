import { Suspense } from 'react';

import { getUserData } from '@/src/shared/api/getUserData';
import LoadingBar from '@/src/shared/ui/loadingBar';
import { MyPageEditPage } from '@/src/views/mypage';

export default async function Page() {
  const data = await getUserData();

  return (
    <Suspense fallback={<LoadingBar />}>
      <MyPageEditPage userData={data} />
    </Suspense>
  );
}
