export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { SearchParams } from 'nuqs/server';

import { getReviewListData } from '@/src/entities/review';
import { getUserData } from '@/src/shared/api/getUserData';
import { reviewKeys, userKeys } from '@/src/shared/config/queryKeys';
import { loadReviewParams } from '@/src/shared/lib/nuqs/searchParams';

import { ReviewPage } from './ui/ReviewPage';

type TPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: TPageProps) {
  const { page, franchisee } = await loadReviewParams(searchParams);
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: reviewKeys.list({ page, franchisee }),
      queryFn: () => getReviewListData(page, franchisee),
    }),
    queryClient.prefetchQuery({ queryKey: userKeys.all, queryFn: getUserData }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReviewPage />
    </HydrationBoundary>
  );
}
