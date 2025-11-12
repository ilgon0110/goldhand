import dynamic from 'next/dynamic';

import { cn } from '@/lib/utils';
import { SponsorList } from '@/src/widgets/goldHandSponsor';
import { FranchiseeSheetList } from '@/src/widgets/goldHandSpotSheet';
import { ImageSlideList } from '@/src/widgets/ImageSlideList';
import { MainTitle } from '@/src/widgets/MainTitle/ui/MainTitle';
import { PriceList } from '@/src/widgets/pricewidgets';

const ReviewCarousel = dynamic(
  () => import('@/src/widgets/goldHandReview/ui/ReviewCarousel').then(m => m.ReviewCarousel),
  { ssr: false, loading: () => <div className="h-48" /> },
);

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
        <ReviewCarousel />
        <FranchiseeSheetList />
        <PriceList />
        <SponsorList />
      </section>
    </>
  );
}
