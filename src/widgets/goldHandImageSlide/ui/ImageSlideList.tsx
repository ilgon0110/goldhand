"use client";

import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent } from "@/src/shared/ui/carousel";
import { useRef } from "react";
import { ImageCard } from "./ImageCard";
import { gowunDodumFont } from "@/src/shared/fonts";

export function ImageSlideList() {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));
  const images = [
    "/imageslide/goldhand_imageslide_1.jpg",
    "/imageslide/goldhand_imageslide_2.jpg",
    "/imageslide/goldhand_imageslide_3.jpg",
  ];

  return (
    <div className="flex flex-col md:flex-row">
      <div
        className={`w-full md:w-[46vw] ${gowunDodumFont.className} text-sm md:text-base lg:text-xl top-1/2 flex flex-col justify-center`}
      >
        <span
          className={`text-4xl xl:text-[72px] leading-relaxed break-keep text-center md:text-left`}
        >
          고운황금손 카피라이트 한줄.
          <span className="text-[#728146]">고운황금손</span>
        </span>
        <div className="space-y-1 flex flex-col mt-12 text-center md:text-base">
          <span>안녕하세요. 고운황금손 산후도우미 입니다.</span>
          <span>
            사랑과 전문 지식을 바탕으로 산모와 아기를 보살펴 드립니다.
          </span>
          <span>
            산모와 아기가 편안한 휴식을 취할 수 있도록 최선을 다하겠습니다.
          </span>
          <span>{`"고운황금손이 도와드리겠습니다".`}</span>
        </div>
        <div className="flex flex-row gap-4 pr-0 md:pr-9 mt-8">
          <Button text="예약상담 하러가기" />
          <Button text="관리사 지원하기" />
          <Button text="가맹점 신청하기" />
        </div>
      </div>
      <Carousel
        plugins={[plugin.current]}
        //onMouseEnter={plugin.current.stop}
        //onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="w-[100vw] h-[76vw] md:w-[54vw] md:h-[45vw] relative mt-6 md:mt-0">
          <ImageCard src={images[0]} alt="Gold Hand" />
          <ImageCard src={images[1]} alt="Gold Hand" />
          <ImageCard src={images[2]} alt="Gold Hand" />
        </CarouselContent>
        {/* <CarouselPrevious />
      <CarouselNext /> */}
      </Carousel>
    </div>
  );
}

const Button = ({ text }: { text: string }) => {
  return (
    <button className="w-full rounded-full h-8 md:h-14 border border-[#0F2E16] text-[12px] md:text-xl hover:bg-[#0F2E16] hover:text-white transition-all transform ease-in-out duration-300">
      {text}
    </button>
  );
};
