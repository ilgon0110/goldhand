import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { GET as priceGET } from '@/app/api/price/route';
import { GET as reviewListGET } from '@/app/api/review/route';
import { routeGet } from '@/app/lib/routeGet';
import { cn } from '@/lib/utils';
import { priceQueryOptions } from '@/src/entities/price';
import { OAuthSuccessHandler } from '@/src/feature/auth';
import { FranchiseeSheetList, ImageSlideList, MainTitle, PriceList, SponsorList } from '@/src/feature/home';
import { reviewCarouselQueryOptions } from '@/src/feature/home';
import { ReviewCarousel } from '@/src/feature/home';
import { HOME_CONTAINER } from '@/src/feature/home';
import { EventModal } from '@/src/widgets/event';

export default async function Home() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(reviewCarouselQueryOptions(routeGet(reviewListGET))),
    queryClient.prefetchQuery(priceQueryOptions(routeGet(priceGET))),
  ]);

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
      <section className={cn(HOME_CONTAINER, 'space-y-24 py-24', 'md:space-y-36 md:py-32')}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ReviewCarousel />
        </HydrationBoundary>
        <FranchiseeSheetList />
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PriceList />
        </HydrationBoundary>
        <SponsorList />
      </section>
    </>
  );
}
