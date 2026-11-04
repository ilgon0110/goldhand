import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { getPriceData } from '@/src/entities/price';
import { getReviewListData } from '@/src/entities/review';
import { OAuthSuccessHandler } from '@/src/feature/auth';
import { FranchiseeSheetList, ImageSlideList, MainTitle, PriceList, SponsorList } from '@/src/feature/home';
import { ReviewCarousel } from '@/src/feature/home/reviewCarousel/ui/ReviewCarousel';
import { HOME_CONTAINER } from '@/src/feature/home/ui/homeContainer';
import { priceKeys, reviewKeys } from '@/src/shared/config/queryKeys';
import { EventModal } from '@/src/widgets/event/ui/EventModal';

export default async function Home() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({ queryKey: reviewKeys.carousel(), queryFn: () => getReviewListData(1, '전체') }),
    queryClient.prefetchQuery({ queryKey: priceKeys.all, queryFn: getPriceData }),
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
