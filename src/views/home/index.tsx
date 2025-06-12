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
      <section className="my-10 md:my-32">
        <MainTitle />
      </section>
      <section className="space-y-10 px-4 md:space-y-32 md:px-9">
        <FranchiseeSheetList />
        <ReviewCarousel data={data.reviewData} />
        <SponsorList />
        <article className="md:px-[10vw]">
          <PriceList />
        </article>
      </section>
    </>
  );
}
