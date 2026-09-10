import { redirect } from 'next/navigation';

import { getUserLoginData } from '@/src/shared/api/getUserData';

import { getManagerApplyDetailData } from './api';
import { ManagerApplyDetailPage } from './ui/ManagerApplyDetailPage';

type TPageProps = {
  params: Promise<{ docId: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { docId } = await params;

  // 세션이 없거나 만료된 경우, 그리고 관리자가 아닌 경우 전역 에러 페이지 대신 로그인으로 보낸다.
  // 데이터 조회보다 먼저 검증해서, 인가 실패 시 상세 데이터를 아예 가져오지 않도록 한다.
  let userData: Awaited<ReturnType<typeof getUserLoginData>>;
  try {
    userData = await getUserLoginData();
  } catch {
    redirect('/login');
  }

  if (userData.userData?.grade !== 'admin') {
    redirect('/login');
  }

  const data = await getManagerApplyDetailData({ docId });

  return <ManagerApplyDetailPage managerApplyDetailData={data.data} userId={userData.userData.userId} />;
}
