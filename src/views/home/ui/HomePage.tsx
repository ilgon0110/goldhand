import type { IReviewListResponseData } from '@/src/shared/types';
import { getReviewListData } from '@/src/views/review';
import { ImageSlideList } from '@/src/widgets/goldHandImageSlide';
import { MainTitle } from '@/src/widgets/goldHandMainTitle/ui/MainTitle';
import { ReviewCarousel } from '@/src/widgets/goldHandReview';
import { SponsorList } from '@/src/widgets/goldHandSponsor';
import { FranchiseeSheetList } from '@/src/widgets/goldHandSpotSheet';
import { PriceList } from '@/src/widgets/pricewidgets';

export async function HomePage() {
  const data: IReviewListResponseData = await getReviewListData(1, '전체');
  return (
    <>
      <section>
        <ImageSlideList />
      </section>
      <section>
        <MainTitle />
      </section>
      <section className="mt-24 space-y-48 px-4 md:px-[10vw]">
        <ReviewCarousel data={data.reviewData} />
        <FranchiseeSheetList />
        <PriceList />
        <SponsorList />
      </section>
    </>
  );
}
