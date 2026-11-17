import type { SearchParams } from 'nuqs/server';

import { GET as userGET } from '@/app/api/user/route';
import type { IUserResponseData } from '@/src/entities/user';
import { jsonOrThrow } from '@/src/shared/api/request';
import { loadManagerListParams } from '@/src/shared/lib/nuqs/searchParams';

import { getManagerListData } from './api';
import { ManagerListPage } from './ui/ManagerListPage';

type TPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: TPageProps) {
  const userData = await jsonOrThrow<IUserResponseData>(await userGET());
  const { page } = await loadManagerListParams(searchParams);
  const data = await getManagerListData(page);

  if (userData.userData?.grade !== 'admin') {
    throw new Error('접근 권한이 없습니다.');
  }

  return <ManagerListPage managerListData={data.data} totalDataLength={data.totalDataLength} />;
}
