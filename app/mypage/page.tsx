import { Suspense } from 'react';

import LoadingBar from '@/src/shared/ui/loadingBar';
import { MyPagePage } from '@/src/views/mypage';
import { getMyPageData } from '@/src/views/mypage/api/loader';

export default async function Page() {
  const data = await getMyPageData();

  if (data.response !== 'ok') {
    throw new Error(data.message || '마이페이지 데이터를 불러오는 중 오류가 발생했습니다.');
  }

  return (
    <Suspense fallback={<LoadingBar />}>
      <MyPagePage myPageData={data} />
    </Suspense>
  );
}
