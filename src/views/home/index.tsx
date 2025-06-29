import { ImageSlideList } from '@/src/widgets/goldHandImageSlide';
import { MainTitle } from '@/src/widgets/goldHandMainTitle/ui/MainTitle';
import { ReviewCarousel } from '@/src/widgets/goldHandReview';
import { SponsorList } from '@/src/widgets/goldHandSponsor';
import { FranchiseeSheetList } from '@/src/widgets/goldHandSpotSheet';
import { PriceList } from '@/src/widgets/pricewidgets';

import type { IReviewData } from '../review';
import { getReviewListData } from '../review';

export async function HomePage() {
  const data: IReviewData = await getReviewListData(1, '전체');
  return (
    <>
      <section>
        <ImageSlideList />
      </section>
      <section className="-mt-12 md:px-[10vw]">
        <MainTitle />
      </section>
      <section className="mt-24 space-y-10 px-4 md:space-y-32 md:px-[10vw]">
        <FranchiseeSheetList />
        <ReviewCarousel data={data.reviewData} />
        <SponsorList />
        <PriceList />
      </section>
    </>
  );
}
