import { Suspense } from 'react';

import { cn } from '@/lib/utils';
import { ReviewCarousel } from '@/src/widgets/goldHandReview';
import { SponsorList } from '@/src/widgets/goldHandSponsor';
import { FranchiseeSheetList } from '@/src/widgets/goldHandSpotSheet';
import { ImageSlideList } from '@/src/widgets/ImageSlideList';
import { MainTitle } from '@/src/widgets/MainTitle/ui/MainTitle';
import { PriceList } from '@/src/widgets/pricewidgets';

export async function HomePage() {
  return (
    <>
      <section>
        <ImageSlideList />
      </section>
      <section>
        <MainTitle />
      </section>
      <section className={cn('mx-auto mt-24 max-w-6xl space-y-24 px-4', 'sm:space-y-48 sm:px-12')}>
        <Suspense fallback={null}>
          <ReviewCarousel />
        </Suspense>
        <FranchiseeSheetList />
        <PriceList />
        <SponsorList />
      </section>
    </>
  );
}
