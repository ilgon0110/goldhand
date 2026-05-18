export const dynamic = 'force-dynamic';

import type { SearchParams } from 'nuqs/server';

import { getReviewListData } from '@/src/entities/review';
import { getUserData } from '@/src/shared/api/getUserData';
import { loadReviewParams } from '@/src/shared/lib/nuqs/searchParams';

import { ReviewPage } from './ui/ReviewPage';

type TPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: TPageProps) {
  const { page, franchisee } = await loadReviewParams(searchParams);
  const data = await getReviewListData(page, franchisee);
  const userData = await getUserData();

  return <ReviewPage data={data} isLogin={userData.userData != null} />;
}
