import { ImageSlideList } from "@/src/widgets/goldHandImageSlide";
import { ReviewCarousel } from "@/src/widgets/goldHandReview";
import { SponsorList } from "@/src/widgets/goldHandSponsor";
import { SpotSheetList } from "@/src/widgets/goldHandSpotSheet";
import { MainTitle } from "@/src/widgets/goldHandMainTitle/ui/MainTitle";
import { PriceList } from "@/src/widgets/pricewidgets";
import { getReviewListData, IReviewData } from "../review";

export async function HomePage() {
  const data: IReviewData = await getReviewListData(1);
  return (
    <>
      <section>
        <ImageSlideList />
      </section>
      <section className="my-10 md:my-32">
        <MainTitle />
      </section>
      <section className="px-4 md:px-9 space-y-10 md:space-y-32">
        <SpotSheetList />
        <ReviewCarousel data={data.reviewData} />
        <SponsorList />
        <article className="md:px-[10vw]">
          <PriceList />
        </article>
      </section>
    </>
  );
}
