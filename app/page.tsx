import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { getReviewListData } from '@/src/entities/review';
import { OAuthSuccessHandler } from '@/src/feature/auth';
import { FaqSection, FranchiseeSheetList, ImageSlideList, MainTitle, PriceList, SponsorList } from '@/src/feature/home';
import { ReviewCarousel } from '@/src/feature/home/reviewCarousel/ui/ReviewCarousel';
import { reviewKeys } from '@/src/shared/config/queryKeys';
import { EventModal } from '@/src/widgets/event/ui/EventModal';

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: reviewKeys.carousel(),
    queryFn: () => getReviewListData(1, '전체'),
  });

  return (
    <>
      <OAuthSuccessHandler />
      <EventModal />
      <section>
        <ImageSlideList />
      </section>
      <section>
        <MainTitle />
      </section>
      <section className={cn('mx-auto mt-24 max-w-7xl space-y-24 px-4', 'sm:space-y-48')}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ReviewCarousel />
        </HydrationBoundary>
        <FranchiseeSheetList />
        <PriceList />
        <FaqSection />
        <SponsorList />
      </section>
    </>
  );
}
