import { ImageSlideList } from "@/src/widgets/goldHandImageSlide";
import { ReviewCarousel } from "@/src/widgets/goldHandReview";
import { SponsorList } from "@/src/widgets/goldHandSponsor";
import { SpotSheetList } from "@/src/widgets/goldHandSpotSheet";
import { MainTitle } from "@/src/widgets/goldHandMainTitle/ui/MainTitle";
import { PriceList } from "@/src/widgets/pricewidgets";

export function HomePage() {
  return (
    <>
      <section className="px-4 md:px-9 mt-9">
        <ImageSlideList />
      </section>
      <section className="my-10 md:my-32">
        <MainTitle />
      </section>
      <section className="px-4 md:px-9 space-y-10 md:space-y-32">
        <SpotSheetList />
        <ReviewCarousel />
        <SponsorList />
        <article className="md:px-[10vw]">
          <PriceList />
        </article>
      </section>
    </>
  );
}
