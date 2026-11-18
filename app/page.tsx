import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { GET as priceGET } from '@/app/api/price/route';
import { GET as reviewListGET } from '@/app/api/review/route';
import { routeGet } from '@/app/lib/routeGet';
import { cn } from '@/lib/utils';
import { makeQueryClient } from '@/src/app/providers/get-query-client';
import { priceQueryOptions } from '@/src/entities/price';
import { OAuthSuccessHandler } from '@/src/feature/auth';
import { FranchiseeSheetList, ImageSlideList, MainTitle, PriceList, SponsorList } from '@/src/feature/home';
import { reviewCarouselQueryOptions } from '@/src/feature/home';
import { ReviewCarousel } from '@/src/feature/home';
import { HOME_CONTAINER, PriceListSkeleton, ReviewCarouselSkeleton } from '@/src/feature/home';
import { AsyncBoundary } from '@/src/shared/ui/AsyncBoundary';
import { EventModal } from '@/src/widgets/event';

// 데이터를 await하지 않으므로 Next가 정적 page로 판단해 build 시 prerender를 시도한다(API의 cookies()가 핸들러 catch에 삼켜짐).
// 요청마다 렌더하던 기존 동작을 유지한다.
export const dynamic = 'force-dynamic';

export default function Home() {
  const queryClient = makeQueryClient();

  // await하지 않는다. 정적 섹션은 바로 그리고, 후기·요금은 pending으로 dehydrate돼 각 섹션의 Suspense 뒤에서 스트리밍된다.
  void queryClient.prefetchQuery(reviewCarouselQueryOptions(routeGet(reviewListGET)));
  void queryClient.prefetchQuery(priceQueryOptions(routeGet(priceGET)));

  return (
    <>
      <OAuthSuccessHandler />
      <EventModal />
      <section>
        <ImageSlideList />
      </section>
      <section className={cn('bg-muted/50 py-20', 'md:py-32')}>
        <div className={HOME_CONTAINER}>
          <MainTitle />
        </div>
      </section>
      {/* dehydrate는 1번만 한다(같은 client를 두 번 dehydrate하면 데이터가 payload에 2번 직렬화됨). */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <section className={cn(HOME_CONTAINER, 'space-y-24 py-24', 'md:space-y-36 md:py-32')}>
          <AsyncBoundary pendingFallback={<ReviewCarouselSkeleton />}>
            <ReviewCarousel />
          </AsyncBoundary>
          <FranchiseeSheetList />
          <AsyncBoundary pendingFallback={<PriceListSkeleton />}>
            <PriceList />
          </AsyncBoundary>
          <SponsorList />
        </section>
      </HydrationBoundary>
    </>
  );
}
