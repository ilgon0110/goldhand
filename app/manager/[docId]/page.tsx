import { getUserLoginData } from '@/src/shared/api/getUserData';

import { getManagerApplyDetailData } from './api';
import { ManagerApplyDetailPage } from './ui/ManagerApplyDetailPage';

type TPageProps = {
  params: Promise<{ docId: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { docId } = await params;
  const userData = await getUserLoginData();
  const data = await getManagerApplyDetailData({
    docId,
  });

  if (userData.userData?.grade !== 'admin') {
    throw new Error('접근 권한이 없습니다.');
  }

  return <ManagerApplyDetailPage managerApplyDetailData={data.data} userId={userData.userData.userId} />;
}
