import { Suspense } from 'react';

import { getUserData } from '@/src/shared/api/getUserData';
import LoadingBar from '@/src/shared/ui/loadingBar';
import { getManagerApplyDetailData, ManagerApplyDetailPage } from '@/src/views/manager';

type TPageProps = {
  params: { docId: string };
};

export default async function Page({ params }: TPageProps) {
  const { docId } = params;
  const userData = await getUserData();
  const data = await getManagerApplyDetailData({
    docId,
  });

  if (userData.userData?.grade !== 'admin') {
    throw new Error('접근 권한이 없습니다.');
  }

  return (
    <Suspense fallback={<LoadingBar />}>
      <ManagerApplyDetailPage managerApplyDetailData={data.data} userId={userData.userData.userId} />
    </Suspense>
  );
}
