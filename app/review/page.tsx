import type { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

import { loadReviewParams } from '@/src/shared/searchParams';
import LoadingBar from '@/src/shared/ui/loadingBar';
import { getReviewListData, ReviewPage } from '@/src/views/review';
import { getUserData } from '@/src/views/signup';

type TPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: TPageProps) {
  const { page, franchisee } = await loadReviewParams(searchParams);
  const data = await getReviewListData(page, franchisee);
  const userData = await getUserData();
  return (
    <Suspense fallback={<LoadingBar />}>
      <ReviewPage data={data} isLogin={userData.response === 'ok'} />
    </Suspense>
  );
}
