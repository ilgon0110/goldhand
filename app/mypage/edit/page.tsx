import { Suspense } from 'react';

import { getUserData } from '@/src/shared/api/getUserData';
import LoadingBar from '@/src/shared/ui/loadingBar';
import { MyPageEditPage } from '@/src/views/mypage';

export default async function Page() {
  const userData = await getUserData();

  if (userData.response === 'ng') {
    throw new Error(userData.message);
  }

  if (userData.response === 'unAuthorized') {
    throw new Error('로그인이 필요합니다.');
  }

  return (
    <Suspense fallback={<LoadingBar />}>
      <MyPageEditPage userData={userData} />
    </Suspense>
  );
}
