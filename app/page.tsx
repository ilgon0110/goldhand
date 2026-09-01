import { Suspense } from 'react';

import { cn } from '@/lib/utils';
import { FaqSection, FranchiseeSheetList, ImageSlideList, MainTitle, PriceList, SponsorList } from '@/src/feature/home';
import { EventModal } from '@/src/widgets/event/ui/EventModal';
import { ReviewCarousel } from '@/src/feature/home/reviewCarousel/ui/ReviewCarousel';

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <EventModal />
      </Suspense>
      <section>
        <ImageSlideList />
      </section>
      <section>
        <MainTitle />
      </section>
      <section className={cn('mx-auto mt-24 max-w-7xl space-y-24 px-4', 'sm:space-y-48')}>
        <ReviewCarousel />
        <FranchiseeSheetList />
        <PriceList />
        <FaqSection />
        <SponsorList />
      </section>
    </>
  );
}
