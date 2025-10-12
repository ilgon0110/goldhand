import type { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

import { getUserData } from '@/src/shared/api/getUserData';
import { loadManagerListParams } from '@/src/shared/lib/nuqs/searchParams';
import LoadingBar from '@/src/shared/ui/loadingBar';
import { getManagerListData, ManagerListPage } from '@/src/views/manager';

type TPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: TPageProps) {
  const userData = await getUserData();
  const { page } = await loadManagerListParams(searchParams);
  const data = await getManagerListData(page);

  if (userData.userData?.grade !== 'admin') {
    throw new Error('접근 권한이 없습니다.');
  }

  return (
    <Suspense fallback={<LoadingBar />}>
      <ManagerListPage managerListData={data.data} totalDataLength={data.totalDataLength} />
    </Suspense>
  );
}
