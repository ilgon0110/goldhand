'use client';

import Autoplay from 'embla-carousel-autoplay';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

import { gowunDodumFont } from '@/src/shared/fonts';
import { Carousel, CarouselContent } from '@/src/shared/ui/carousel';

import { ImageCard } from './ImageCard';

export function ImageSlideList() {
  const router = useRouter();

  const onClickButton = (text: string) => {
    switch (text) {
      case '예약상담 하러가기':
        router.push('/reservation');
        break;
      case '정부지원바우처 확인하기':
        router.push('/voucher');
        break;
      case '가맹점 신청하기':
        router.push('/franchisee/apply');
        break;
      default:
        break;
    }
  };

  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false }));
  const images = ['/imageslide/goldhand_imageslide_0.png', '/imageslide/goldhand_imageslide_1.png'];

  const buttonList = ['예약상담 하러가기', '정부지원바우처 확인하기'];

  return (
    <div className="relative flex h-[70vh] flex-col overflow-hidden md:flex-row">
      <Carousel
        plugins={[plugin.current]}
        //onMouseEnter={plugin.current.stop}
        //onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="absolute top-0 -z-10 h-[100vh] w-[100vw]">
          <ImageCard alt="Gold Hand" src={images[0]} />
          <ImageCard alt="Gold Hand" src={images[1]} />
        </CarouselContent>
      </Carousel>
      <div
        className={`${gowunDodumFont.className} absolute top-1/2 flex -translate-y-1/2 flex-col justify-center px-4 text-sm md:px-[10vw] md:text-base lg:text-xl`}
      >
        <span
          className={`break-keep text-center text-4xl leading-relaxed text-white md:text-left xl:text-[72px]`}
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
        >
          고운황금손 카피라이트 한줄
        </span>
        <div
          className="flex flex-col space-y-1 text-base text-white md:text-2xl"
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
        >
          <span>아기를 맞이하는 순간 고운황금손이 기쁨으로 다가가겠습니다.</span>
        </div>
        <div className="mt-8 flex flex-row gap-2 pr-0 md:gap-4 md:pr-9">
          {buttonList.map(text => (
            <Button key={text} text={text} onClick={() => onClickButton(text)} />
          ))}
        </div>
      </div>
    </div>
  );
}

const Button = ({ text, onClick }: { text: string; onClick: () => void }) => {
  return (
    <button
      className="h-12 w-full transform rounded-full border border-[#0F2E16] bg-white/70 text-sm text-[#0F2E16] transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-[#0F2E16] hover:text-white md:h-14 md:text-lg"
      onClick={onClick}
    >
      {text}
    </button>
  );
};
