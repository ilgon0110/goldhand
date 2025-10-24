import { Suspense } from 'react';

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
      <section className="mx-auto mt-24 max-w-6xl space-y-48">
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
