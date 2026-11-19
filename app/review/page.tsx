export const dynamic = 'force-dynamic';

import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import type { SearchParams } from 'nuqs/server';

import { GET as reviewListGET } from '@/app/api/review/route';
import { routeGet } from '@/app/lib/routeGet';
import { makeQueryClient } from '@/src/app/providers/get-query-client';
import { reviewListQueryOptions } from '@/src/entities/review';
import { loadReviewParams } from '@/src/shared/lib/nuqs/searchParams';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

import { ReviewPage } from './ui/ReviewPage';

type TPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: TPageProps) {
  const { page, franchisee } = await loadReviewParams(searchParams);
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery(reviewListQueryOptions({ page, franchisee }, routeGet(reviewListGET)));

  return (
    <>
      <SectionTitleHero description="고운황금손 산모님들의 소중한 후기를 확인해보세요" label="이용 후기" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ReviewPage />
      </HydrationBoundary>
    </>
  );
}
