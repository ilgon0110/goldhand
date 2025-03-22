import { getTodayDate } from "@/src/shared/utils";
import { ReviewCard } from "../index";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/shared/ui/carousel";
import { SectionTitle } from "@/src/shared/ui/sectionTitle";

type ReviewCarouselProps = {
  title: string;
  author: string;
  created_at: string;
  description: string;
  thumbnail: string | null;
};

export const ReviewCarousel = () => {
  const items: ReviewCarouselProps[] = [
    {
      title: "문은숙 선생님 감사합니다",
      author: "김은숙",
      created_at: getTodayDate(),
      description:
        "저는 어떤 일을 시작하거나, 결정할때 안좋은 경험을 겪게될것만 생각하면 아무일도 못한다라는 생각으로 살던 사람인데, 아이를 임신하니 그 생각이 싹 무너지면서 산후도우미에 대한 안좋은 뉴스들",
      thumbnail: null,
    },
    {
      title: "문은숙 선생님 감사합니다",
      author: "김은숙",
      created_at: getTodayDate(),
      description: "ㄱㅅ",
      thumbnail: "/review_thumbnail.png",
    },
    {
      title: "문은숙 선생님 감사합니다",
      author: "김은숙",
      created_at: getTodayDate(),
      description:
        "저는 어떤 일을 시작하거나, 결정할때 안좋은 경험을 겪게될것만 생각하면 아무일도 못한다라는 생각으로 살던 사람인데, 아이를 임신하니 그 생각이 싹 무너지면서 산후도우미에 대한 안좋은 뉴스들",
      thumbnail: null,
    },
    {
      title: "문은숙 선생님 감사합니다",
      author: "김은숙",
      created_at: getTodayDate(),
      description: "ㄱㅅ",
      thumbnail: null,
    },
    {
      title: "문은숙 선생님 감사합니다",
      author: "김은숙",
      created_at: getTodayDate(),
      description: "ㄱㅅ",
      thumbnail: "/review_thumbnail.png",
    },
    {
      title: "문은숙 선생님 감사합니다",
      author: "김은숙",
      created_at: getTodayDate(),
      description: "ㄱㅅ",
      thumbnail: null,
    },
  ];
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
            {items.map((item, index) => (
              <CarouselItem key={index} className="basis-1/1 sm:basis-1/3">
                <div className="px-1 flex flex-row">
                  <ReviewCard key={index} {...item} />
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
        {items.slice(0, 3).map((item, index) => (
          <div key={index} className="px-1 flex flex-row max-h-32">
            <ReviewCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
};
