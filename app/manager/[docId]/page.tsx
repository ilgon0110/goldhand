import { redirect } from 'next/navigation';

import { GET as managerDetailGET } from '@/app/api/manager/detail/route';
import { GET as userGET } from '@/app/api/user/route';
import { routeGet } from '@/app/lib/routeGet';
import type { IManagerApplyDetailResponseData } from '@/src/entities/manager';
import type { IUserResponseData } from '@/src/entities/user';
import { jsonOrThrow } from '@/src/shared/api/request';

import { ManagerApplyDetailPage } from './ui/ManagerApplyDetailPage';

type TPageProps = {
  params: Promise<{ docId: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { docId } = await params;

  // 세션이 없거나 만료된 경우, 그리고 관리자가 아닌 경우 전역 에러 페이지 대신 로그인으로 보낸다.
  // 데이터 조회보다 먼저 검증해서, 인가 실패 시 상세 데이터를 아예 가져오지 않도록 한다.
  let userData: IUserResponseData;
  try {
    userData = await jsonOrThrow<IUserResponseData>(await userGET());
  } catch {
    redirect('/login');
  }

  if (userData.userData?.grade !== 'admin') {
    redirect('/login');
  }

  // 자기 서버로 HTTP 요청(authFetcher)하지 않고 Route Handler를 같은 프로세스에서 호출한다.
  const data = await jsonOrThrow<IManagerApplyDetailResponseData>(
    await routeGet(managerDetailGET)(`/api/manager/detail?docId=${encodeURIComponent(docId)}`),
  );

  // 댓글 폼의 user는 루트 layout이 스트리밍한 ['user'] 캐시를 쓴다.
  return <ManagerApplyDetailPage managerApplyDetailData={data.data} userId={userData.userData.userId} />;
}
