import dynamic from 'next/dynamic';

import { cn } from '@/lib/utils';
import { FranchiseeSheetList, ImageSlideList, MainTitle, PriceList, SponsorList } from '@/src/feature/home';
import { EventModal } from '@/src/widgets/event/ui/EventModal';

const ReviewCarousel = dynamic(
  () => import('@/src/feature/home/reviewCarousel/ui/ReviewCarousel').then(m => m.ReviewCarousel),
  { ssr: false, loading: () => <div className="h-48 w-full animate-pulse rounded-md bg-gray-200" /> },
);

export default function Home() {
  return (
    <>
      <EventModal />
      <section aria-label="메인 이미지 슬라이드">
        <ImageSlideList />
      </section>
      <section aria-label="서비스 소개">
        <MainTitle />
      </section>
      <section
        aria-label="이용후기, 지점 소개, 이용요금, 협력사"
        className={cn('mx-auto mt-24 max-w-7xl space-y-24 px-4', 'sm:space-y-48')}
      >
        <ReviewCarousel />
        <FranchiseeSheetList />
        <PriceList />
        <SponsorList />
      </section>
    </>
  );
}
