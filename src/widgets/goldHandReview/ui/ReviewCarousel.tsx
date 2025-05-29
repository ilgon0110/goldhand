"use client";

import {
  generateDescription,
  generateThumbnailUrl,
  getTodayDate,
} from "@/src/shared/utils";
import { ReviewCard } from "../index";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/shared/ui/carousel";
import { SectionTitle } from "@/src/shared/ui/sectionTitle";
import { IReviewData } from "@/src/views/review";
import { useRouter } from "next/navigation";

type ReviewCarouselProps = {
  title: string;
  author: string;
  created_at: string;
  description: string;
  thumbnail: string | null;
};

export const ReviewCarousel = ({
  data,
}: {
  data: IReviewData["reviewData"];
}) => {
  const router = useRouter();

  return (
    <div className="w-full">
      <div className="flex flex-col justify-center items-center gap-6 mb-12 whitespace-pre-wrap">
        <SectionTitle
          title={`소중한 산모님들이 남긴\n\n고운황금손 이용후기 입니다.`}
          buttonTitle="이용후기 보러가기"
        />
      </div>
      {/* 웹버전, width:640px 이상 */}
      <div className="hidden sm:block px-0 md:px-[16vw]">
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
          orientation="horizontal"
        >
          <CarouselContent>
            {data?.map((item) => (
              <CarouselItem key={item.id} className="basis-1/1 sm:basis-1/3">
                <div className="px-1 flex flex-row">
                  <ReviewCard
                    title={item.title}
                    author={item.name}
                    createdAt={item.createdAt}
                    description={generateDescription(item.htmlString)}
                    thumbnail={generateThumbnailUrl(item.htmlString)}
                    onClick={() => {
                      router.push(`/review/${item.id}`);
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:inline-flex" />
          <CarouselNext className="hidden md:inline-flex" />
        </Carousel>
      </div>
      {/* 모바일버전, width:640px 미만 */}
      <div className="flex flex-col sm:hidden gap-3">
        {data.map((item) => (
          <div key={item.id} className="px-1 flex flex-row max-h-32">
            <ReviewCard
              title={item.title}
              author={item.name}
              createdAt={item.createdAt}
              description={item.htmlString}
              thumbnail={null}
              onClick={() => {
                router.push(`/review/${item.id}`);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
