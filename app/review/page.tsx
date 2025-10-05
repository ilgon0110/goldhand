export const dynamic = 'force-dynamic';

import { Suspense } from 'react';

import { getUserData } from '@/src/shared/api/getUserData';
import LoadingBar from '@/src/shared/ui/loadingBar';
import { getReviewListData, ReviewPage } from '@/src/views/review';

type TPageProps = {
  //searchParams: Promise<SearchParams>;
  searchParams: {
    page: string;
    franchisee: string;
  };
};

export default async function Page({ searchParams }: TPageProps) {
  //const { page, franchisee } = await loadReviewParams(searchParams);
  const page = Number(searchParams.page) || 1;
  const franchisee = searchParams.franchisee || '전체';
  const data = await getReviewListData(page, franchisee);
  const userData = await getUserData();
  return (
    <Suspense fallback={<LoadingBar />}>
      <ReviewPage data={data} isLogin={userData.isLinked} />
    </Suspense>
  );
}
