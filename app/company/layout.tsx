'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { SlArrowDown } from 'react-icons/sl';
import { useInView } from 'react-intersection-observer';

import { cn } from '@/lib/utils';

export default function CompanyLayout({ children }: { children: React.ReactNode }) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { ref: observerRef, inView } = useInView({
    threshold: 0.1, // 10%가 화면에 보이면 inView가 true
  });

  const floatUpAnimation = 'opacity-0 animate-floatUp fill-mode-forwards';

  const handleScroll = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: 'smooth', // 스크롤 애니메이션
        block: 'start', // `top-0` 위치로 정렬
      });
    }
  };

  return (
    <>
      <div className="relative h-[100vh] w-[100vw]">
        <div className="absolute left-0 top-0 z-10 h-full w-full bg-gradient-to-b from-transparent from-10% to-black to-85%" />
        <div className="absolute left-0 top-0 h-full w-full">
          <Image
            alt="회사소개 배경 이미지"
            fill
            sizes="100vw"
            src="/company_background.jpeg"
            style={{
              objectFit: 'cover',
            }}
          />
        </div>
        <div className="absolute bottom-[50vh] w-full">
          <div
            className={cn(
              'delay-50 absolute top-0 z-20 w-full animate-floatUp text-center text-3xl text-white opacity-0 fill-mode-forwards md:text-7xl',
              floatUpAnimation,
            )}
          >
            GOLD BABY
          </div>
          <div
            className={cn(
              'absolute top-12 z-20 w-full text-center text-3xl font-bold text-[#728146] delay-100 md:top-20 md:text-7xl',
              floatUpAnimation,
            )}
          >
            고운황금손
          </div>
          <div
            className={cn(
              'absolute top-24 z-20 w-full text-center text-xl text-white delay-500 md:top-48 md:text-4xl',
              floatUpAnimation,
            )}
          >
            홈페이지를 찾아주신 여러분을 환영합니다.
          </div>
        </div>
        <button className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2 animate-bounce" onClick={handleScroll}>
          <SlArrowDown className="h-8 w-8 fill-white" />
        </button>
      </div>
      <div className="relative h-[100vh] w-[100vw]">
        <div
          className="absolute left-0 top-0 z-10 h-full w-full bg-gradient-to-b from-black from-0% to-transparent to-100%"
          ref={node => {
            observerRef(node); // Intersection Observer와 연결
            targetRef.current = node; // scrollIntoView를 위해 연결
          }}
        />
        <div className="absolute left-0 top-0 h-full w-full">
          <Image
            alt="회사소개 배경 이미지"
            fill
            sizes="100vw"
            src="/office_background.jpg"
            style={{
              objectFit: 'cover',
            }}
          />
        </div>
        <section className="absolute top-0 z-20 mt-20 space-y-20 px-8 md:px-20 xl:px-56">{children}</section>
      </div>
    </>
  );
}
