export const dynamic = 'force-dynamic';

import type { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

import { getUserData } from '@/src/shared/api/getUserData';
import { loadReviewParams } from '@/src/shared/lib/nuqs/searchParams';
import LoadingBar from '@/src/shared/ui/loadingBar';
import { getReviewListData, ReviewPage } from '@/src/views/review';

type TPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: TPageProps) {
  const { page, franchisee } = await loadReviewParams(searchParams);
  const data = await getReviewListData(page, franchisee);
  const userData = await getUserData();

  return (
    <Suspense fallback={<LoadingBar />}>
      <ReviewPage data={data} isLogin={userData.userData != null} />
    </Suspense>
  );
}
