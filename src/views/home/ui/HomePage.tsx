import dynamic from 'next/dynamic';

import { cn } from '@/lib/utils';
import { FranchiseeSheetList, ImageSlideList, MainTitle, PriceList, SponsorList } from '@/src/feature/home';

const ReviewCarousel = dynamic(
  () => import('@/src/feature/home/reviewCarousel/ui/ReviewCarousel').then(m => m.ReviewCarousel),
  { ssr: false, loading: () => <div className="h-48 w-full animate-pulse rounded-md bg-gray-200" /> },
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
      <section className={cn('mx-auto mt-24 max-w-7xl space-y-24 px-4', 'sm:space-y-48')}>
        <ReviewCarousel />
        <FranchiseeSheetList />
        <PriceList />
        <SponsorList />
      </section>
    </>
  );
}
