import { Suspense } from 'react';

import LoadingBar from '@/src/shared/ui/loadingBar';
import { MyPagePage } from '@/src/views/mypage';
import { getMyPageData } from '@/src/views/mypage/api/loader';

export default async function Page() {
  const data = await getMyPageData();

  return (
    <Suspense fallback={<LoadingBar />}>
      <MyPagePage myPageData={data} />
    </Suspense>
  );
}
