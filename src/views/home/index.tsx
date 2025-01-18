import { Footer } from "@/src/widgets/footer";
import { ApplyList } from "@/src/widgets/goldHandApply";
import { ImageSlideList } from "@/src/widgets/goldHandImageSlide";
import { ReviewCarousel } from "@/src/widgets/goldHandReview";
import { SponsorList } from "@/src/widgets/goldHandSponsor";
import { SpotSheetList } from "@/src/widgets/goldHandSpotSheet";
import { MainTitle } from "@/src/widgets/goldHandMainTitle/ui/MainTitle";

export function HomePage() {
  return (
    <div>
      <ImageSlideList />
      <section className="px-8 md:px-20 xl:px-56 space-y-20 mt-20">
        <MainTitle />
        <SponsorList />
        <SpotSheetList />
        <ReviewCarousel />
        <ApplyList />
      </section>
      <Footer />
    </div>
  );
}
