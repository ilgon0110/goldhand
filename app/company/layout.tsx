"use client";

import Image from "next/image";
import { SlArrowDown } from "react-icons/sl";
import { useRef } from "react";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { ref: observerRef, inView } = useInView({
    threshold: 0.1, // 10%가 화면에 보이면 inView가 true
  });

  const floatUpAnimation = "opacity-0 animate-floatUp fill-mode-forwards";

  const handleScroll = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth", // 스크롤 애니메이션
        block: "start", // `top-0` 위치로 정렬
      });
    }
  };

  return (
    <>
      <div className="w-[100vw] h-[100vh] relative">
        <div className="w-full h-full absolute top-0 left-0 z-10 bg-gradient-to-b from-transparent from-10% to-85% to-black" />
        <div className="w-full h-full absolute top-0 left-0">
          <Image
            src="/company_background.jpg"
            alt="회사소개 배경 이미지"
            fill
            style={{
              objectFit: "cover",
            }}
            sizes="100vw"
          />
        </div>
        <div className="w-full absolute bottom-[50vh]">
          <div
            className={cn(
              "w-full text-center text-3xl md:text-7xl text-white absolute top-0 z-20 opacity-0 animate-floatUp fill-mode-forwards delay-50",
              floatUpAnimation
            )}
          >
            GOLD BABY
          </div>
          <div
            className={cn(
              "w-full text-center text-3xl md:text-7xl text-[#728146] font-bold absolute top-12 md:top-20 z-20 delay-100",
              floatUpAnimation
            )}
          >
            고운황금손
          </div>
          <div
            className={cn(
              "w-full text-center text-xl md:text-4xl text-white absolute top-24 md:top-48 z-20 delay-500",
              floatUpAnimation
            )}
          >
            홈페이지를 찾아주신 여러분을 환영합니다.
          </div>
        </div>
        <button
          className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 animate-bounce"
          onClick={handleScroll}
        >
          <SlArrowDown className="fill-white w-8 h-8" />
        </button>
      </div>
      <div className="w-[100vw] h-[100vh] relative">
        <div
          ref={(node) => {
            observerRef(node); // Intersection Observer와 연결
            targetRef.current = node; // scrollIntoView를 위해 연결
          }}
          className="w-full h-full absolute top-0 left-0 z-10 bg-gradient-to-b from-black from-0% to-100% to-transparent"
        />
        <div className="w-full h-full absolute top-0 left-0">
          <Image
            src="/office_background.jpg"
            alt="회사소개 배경 이미지"
            fill
            style={{
              objectFit: "cover",
            }}
            sizes="100vw"
          />
        </div>
        <section className="absolute top-0 px-8 md:px-20 xl:px-56 space-y-20 mt-20 z-20">
          {children}
        </section>
      </div>
      <div className="flex flex-col sm:flex-row relative gap-6 px-8 md:px-20 xl:px-56">
        <div className="sm:w-[300px] sm:h-[450px] w-full h-auto aspect-[2/3] relative flex-2 mt-20">
          <Image
            src="/ceo_profile.jpg"
            alt="회사소개 배경 이미지"
            fill
            style={{
              objectFit: "cover",
            }}
            sizes="100vw"
          />
        </div>
        <section className=" space-y-20 sm:mt-20 text-center sm:text-start z-20">
          <div className="flex flex-col gap-2">
            <span className="text-xl text-gray-700">대표자 인사말</span>
            <span className="whitespace-pre-wrap text-2xl">{`대표자 인사말 작성.\n5~6줄정도?\n5~6줄정도?\n5~6줄정도?\n5~6줄정도?\n5~6줄정도?`}</span>
          </div>
        </section>
      </div>
    </>
  );
}
