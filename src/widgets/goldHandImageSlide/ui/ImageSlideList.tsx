"use client";

import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent } from "@/src/shared/ui/carousel";
import { useRef } from "react";
import { ImageCard } from "./ImageCard";
import { gowunDodumFont } from "@/src/shared/fonts";

export function ImageSlideList() {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: false }));
  const images = [
    "/goldhand_main_1.png",
    "/goldhand_main_1.png",
    "/goldhand_main_1.png",
  ];

  return (
    <div className="flex flex-col md:flex-row relative h-[100vh]">
      <Carousel
        plugins={[plugin.current]}
        //onMouseEnter={plugin.current.stop}
        //onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="w-[100vw] h-[100vh] -z-10 absolute top-0">
          <ImageCard src={images[0]} alt="Gold Hand" />
          <ImageCard src={images[1]} alt="Gold Hand" />
          <ImageCard src={images[2]} alt="Gold Hand" />
        </CarouselContent>
      </Carousel>
      <div
        className={`${gowunDodumFont.className} text-sm md:text-base lg:text-xl absolute top-1/2 -translate-y-1/2 flex flex-col justify-center px-4 md:px-9`}
      >
        <span
          className={`text-4xl xl:text-[72px] leading-relaxed break-keep text-center md:text-left text-white`}
          style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5);" }}
        >
          고운황금손 카피라이트 한줄
        </span>
        <div
          className="space-y-1 flex flex-col text-2xl text-white"
          style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5);" }}
        >
          <span>
            아기를 맞이하는 순간 고운황금손이 기쁨으로 다가가겠습니다.
          </span>
        </div>
        <div className="flex flex-row gap-4 pr-0 md:pr-9 mt-8">
          <Button text="예약상담 하러가기" />
          <Button text="관리사 지원하기" />
          <Button text="가맹점 신청하기" />
        </div>
      </div>
    </div>
  );
}

const Button = ({ text }: { text: string }) => {
  return (
    <button className="w-full rounded-full h-8 md:h-14 border border-[#0F2E16] text-[12px] md:text-xl bg-white/70 text-[#0F2E16] hover:bg-[#0F2E16] hover:text-white transition-all transform ease-in-out duration-300">
      {text}
    </button>
  );
};
