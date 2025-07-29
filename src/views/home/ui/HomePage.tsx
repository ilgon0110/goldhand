import type { IReviewData } from '@/src/views/review';
import { getReviewListData } from '@/src/views/review';
import { ImageSlideList } from '@/src/widgets/goldHandImageSlide';
import { MainTitle } from '@/src/widgets/goldHandMainTitle/ui/MainTitle';
import { ReviewCarousel } from '@/src/widgets/goldHandReview';
import { SponsorList } from '@/src/widgets/goldHandSponsor';
import { FranchiseeSheetList } from '@/src/widgets/goldHandSpotSheet';
import { PriceList } from '@/src/widgets/pricewidgets';

export async function HomePage() {
  const data: IReviewData = await getReviewListData(1, '전체');
  return (
    <>
      <section>
        <ImageSlideList />
      </section>
      <section className="-mt-12 px-4 md:px-[10vw]">
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
