export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { SearchParams } from 'nuqs/server';

import { getReviewListData } from '@/src/entities/review';
import { getUserData } from '@/src/shared/api/getUserData';
import { reviewKeys, userKeys } from '@/src/shared/config/queryKeys';
import { loadReviewParams } from '@/src/shared/lib/nuqs/searchParams';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

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
    <>
      <SectionTitleHero description="고운황금손 산모님들의 소중한 후기를 확인해보세요" label="이용 후기" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ReviewPage />
      </HydrationBoundary>
    </>
  );
}
