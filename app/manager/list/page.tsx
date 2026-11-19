import type { SearchParams } from 'nuqs/server';

import { GET as managerListGET } from '@/app/api/manager/list/route';
import { GET as userGET } from '@/app/api/user/route';
import { routeGet } from '@/app/lib/routeGet';
import type { IManagerApplyListData } from '@/src/entities/manager';
import type { IUserResponseData } from '@/src/entities/user';
import { jsonOrThrow } from '@/src/shared/api/request';
import { loadManagerListParams } from '@/src/shared/lib/nuqs/searchParams';

import { ManagerListPage } from './ui/ManagerListPage';

type TPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: TPageProps) {
  // 인가를 먼저 확인해, 관리자가 아니면 목록을 아예 조회하지 않는다.
  const userData = await jsonOrThrow<IUserResponseData>(await userGET());
  if (userData.userData?.grade !== 'admin') {
    throw new Error('접근 권한이 없습니다.');
  }

  const { page } = await loadManagerListParams(searchParams);
  // 자기 서버로 HTTP 요청(authFetcher)하지 않고 Route Handler를 같은 프로세스에서 호출한다.
  const data = await jsonOrThrow<IManagerApplyListData>(
    await routeGet(managerListGET)(`/api/manager/list?page=${page}`),
  );

  return <ManagerListPage managerListData={data.data} totalDataLength={data.totalDataLength} />;
}
