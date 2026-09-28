'use client';

import Autoplay from 'embla-carousel-autoplay';
import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { PiPause, PiPlay } from 'react-icons/pi';

import { cn } from '@/lib/utils';
import imageSlideOne from '@/public/imageslide/goldhand_imageslide_0.png';
import imageSlideTwo from '@/public/imageslide/goldhand_imageslide_1.png';
import { Button } from '@/src/shared/ui/button';
import type { CarouselApi } from '@/src/shared/ui/carousel';
import { Carousel, CarouselContent, CarouselItem } from '@/src/shared/ui/carousel';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';

import { HOME_CONTAINER } from '../../ui/homeContainer';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function ImageSlideList() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  // 자동재생은 reduced motion 여부를 확인한 뒤 effect에서 시작한다.
  const plugin = useRef(Autoplay({ delay: 5000, playOnInit: false, stopOnInteraction: true }));
  const reduceMotion = useReducedMotion();
  const [api, setApi] = useState<CarouselApi>();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!api) return;
    const autoplay = api.plugins().autoplay;
    // autoplay 이벤트는 내부 상태 갱신 전에 발생하므로 isPlaying() 대신 이벤트 종류로 상태를 맞춘다.
    // (스와이프로 자동재생이 멈춘 경우에도 버튼 상태가 동기화된다)
    const handlePlay = () => setIsPlaying(true);
    const handleStop = () => setIsPlaying(false);

    api.on('autoplay:play', handlePlay).on('autoplay:stop', handleStop);
    if (reduceMotion) autoplay.stop();
    else autoplay.play();
    setIsPlaying(autoplay.isPlaying());

    return () => {
      api.off('autoplay:play', handlePlay).off('autoplay:stop', handleStop);
    };
  }, [api, reduceMotion]);

  const handleToggleAutoplay = () => {
    const autoplay = api?.plugins().autoplay;
    if (!autoplay) return;
    if (autoplay.isPlaying()) autoplay.stop();
    else autoplay.play();
  };

  const navigate = (href: string) => startTransition(() => router.push(href));

  const reveal = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE_OUT },
  });

  return (
    <div className={cn('relative isolate h-[78dvh] min-h-[520px] overflow-hidden bg-stone-900', 'md:min-h-[600px]')}>
      {isPending && <LoadingSpinnerOverlay text="해당 페이지로 이동중.." />}
      <Carousel
        className="absolute inset-0 -z-10 [&>div]:h-full [&>div]:py-0"
        plugins={[plugin.current]}
        setApi={setApi}
      >
        <CarouselContent className="h-full">
          <CarouselItem className="relative h-full w-full">
            <Image
              alt="수원 산후도우미 고운황금손 메인 이미지"
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
              alt="광교 용인 산후도우미 고운황금손 서비스"
              fill
              loading="eager"
              placeholder="blur"
              sizes="100vw"
              src={imageSlideTwo}
              style={{ objectFit: 'cover' }}
            />
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      {/* 텍스트 가독성을 위한 스크림: 모바일은 아래에서, 데스크톱은 왼쪽에서 */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/35 to-stone-950/10',
          'md:bg-gradient-to-r md:from-stone-950/70 md:via-stone-950/30 md:to-transparent',
        )}
      />

      <div
        className={cn(HOME_CONTAINER, 'relative flex h-full flex-col justify-end pb-24', 'md:justify-center md:pb-0')}
      >
        <div className="max-w-xl">
          <motion.p
            {...reveal(0)}
            className={cn('break-keep text-3xl font-bold leading-tight text-white', 'md:text-5xl')}
          >
            사랑의 마음으로,
            <br />
            고운황금손
          </motion.p>
          <motion.p
            {...reveal(0.12)}
            className={cn('mt-4 break-keep text-base leading-relaxed text-white/85', 'md:mt-5 md:text-lg')}
          >
            아기를 맞이하는 순간 고운황금손이 기쁨으로 다가가겠습니다.
          </motion.p>
          <motion.div {...reveal(0.24)} className={cn('mt-8 flex flex-col gap-3', 'sm:flex-row')}>
            <Button
              className={cn(
                'h-12 rounded-full bg-goldDeep px-7 text-base font-semibold text-white transition-transform',
                'hover:bg-goldDeep/90 active:scale-[0.98]',
              )}
              onClick={() => navigate('/reservation')}
            >
              예약상담 하러가기
            </Button>
            <Button
              className={cn(
                'h-12 rounded-full border-white/60 bg-white/10 px-7 text-base font-semibold text-white backdrop-blur-sm transition-transform',
                'hover:bg-white/20 hover:text-white active:scale-[0.98]',
              )}
              variant="outline"
              onClick={() => navigate('/voucher')}
            >
              정부바우처 확인하기
            </Button>
          </motion.div>
        </div>
      </div>

      <button
        aria-label={isPlaying ? '슬라이드 자동재생 일시정지' : '슬라이드 자동재생 시작'}
        className={cn(
          'absolute bottom-6 right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/10 text-white backdrop-blur-sm transition-colors duration-200',
          'hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
          'md:bottom-8 md:right-8',
        )}
        type="button"
        onClick={handleToggleAutoplay}
      >
        {isPlaying ? (
          <PiPause aria-hidden="true" className="h-4 w-4" />
        ) : (
          <PiPlay aria-hidden="true" className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
