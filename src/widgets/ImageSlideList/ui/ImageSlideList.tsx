'use client';

import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useTransition } from 'react';

import { cn } from '@/lib/utils';
import imageSlideOne from '@/public/imageslide/goldhand_imageslide_0.png';
import imageSlideTwo from '@/public/imageslide/goldhand_imageslide_1.png';
import { Button } from '@/src/shared/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/src/shared/ui/carousel';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';

export function ImageSlideList() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <div className={cn('relative flex h-[70vh] flex-col overflow-hidden', 'md:flex-row')}>
      {isPending && <LoadingSpinnerOverlay text="해당 페이지로 이동중.." />}
      <Carousel plugins={[plugin.current]}>
        <CarouselContent className="absolute top-0 -z-10 h-[100vh] w-[100vw]">
          <CarouselItem className="relative h-full w-full">
            <Image
              alt="고운황금손 이미지 슬라이드 1번"
              fill
              placeholder="blur"
              priority
              sizes="100vw"
              src={imageSlideOne}
              style={{ objectFit: 'cover' }}
            />
          </CarouselItem>
          <CarouselItem className="relative h-full w-full">
            <Image
              alt="고운황금손 이미지 슬라이드 2번"
              fill
              loading="lazy"
              placeholder="blur"
              priority
              sizes="100vw"
              src={imageSlideTwo}
              style={{ objectFit: 'cover' }}
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <div
        className={cn(
          'absolute top-1/2 flex -translate-y-1/2 flex-col justify-center px-4 text-sm',
          'md:px-[10vw] md:text-base',
          'lg:text-xl',
        )}
      >
        <span
          className={cn(`break-keep text-left text-3xl leading-relaxed text-white`, 'xl:text-[48px]')}
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
        >
          사랑의 마음으로, 고운황금손
        </span>
        <div
          className={cn('flex flex-col space-y-1 text-base text-white', 'md:text-2xl')}
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
        >
          <span>아기를 맞이하는 순간 고운황금손이 기쁨으로 다가가겠습니다.</span>
        </div>
        <div className={cn('mt-8 flex flex-row gap-2 pr-0', 'md:gap-4 md:pr-9')}>
          <Button
            variant="outline"
            onClick={() => {
              startTransition(() => {
                router.push('/reservation');
              });
            }}
          >
            예약상담 하러가기
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              startTransition(() => {
                router.push('/voucher');
              });
            }}
          >
            정부바우처 확인하기
          </Button>
        </div>
      </div>
    </div>
  );
}
