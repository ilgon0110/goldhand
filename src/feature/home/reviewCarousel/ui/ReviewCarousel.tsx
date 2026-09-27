'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { PiArrowRight } from 'react-icons/pi';

import { cn } from '@/lib/utils';
import { generateReviewDescription, generateThumbnailUrl } from '@/src/entities/review';
import type { CarouselApi } from '@/src/shared/ui/carousel';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/src/shared/ui/carousel';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';

import { HomeSectionHeading } from '../../ui/HomeSectionHeading';
import { useReviewCarouselQuery } from '../api/useReviewCarouselQuery';
import { ReviewSummaryCard } from './_ReviewSummaryCard';

export const ReviewCarousel = () => {
  const { data } = useReviewCarouselQuery();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrentIndex(api.selectedScrollSnap());
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const reviewItems = (data ?? []).map(item => ({
    id: item.id,
    author: item.name,
    content: generateReviewDescription(item.htmlString),
    thumbnailSrc: generateThumbnailUrl(item.htmlString),
    title: item.title,
    updatedAt: item.updatedAt,
    handleClick: () => startTransition(() => router.push(`/review/${item.id}`)),
  }));

  if (data?.length === 0) return null;

  return (
    <div className="w-full">
      {isPending && <LoadingSpinnerOverlay text="해당 후기로 이동중.." />}
      <FadeInWhenVisible>
        <div className="mb-10">
          <HomeSectionHeading
            action={
              <button
                className={cn(
                  'inline-flex w-fit items-center gap-2 text-sm font-semibold text-goldDeep transition-colors duration-200',
                  'hover:text-[#6B5224]',
                )}
                type="button"
                onClick={() => startTransition(() => router.push('/review'))}
              >
                모든 이용후기 보기
                <PiArrowRight aria-hidden="true" className="h-4 w-4" />
              </button>
            }
            description="고운황금손 이용후기를 소개합니다."
            title="고운황금손 이용후기"
          />
        </div>
      </FadeInWhenVisible>

      {/* 웹버전, width:768px 이상 */}
      <FadeInWhenVisible delay={0.2}>
        <Carousel
          aria-label="고운황금손 이용후기 목록"
          className={cn('hidden w-full', 'md:block')}
          opts={{ align: 'start' }}
          orientation="horizontal"
          setApi={setApi}
        >
          <CarouselContent className="gap-5">
            {reviewItems.map((item, index) => (
              <CarouselItem
                aria-current={index === currentIndex ? 'true' : undefined}
                className={cn('basis-1/1', 'md:basis-[calc(50%-10px)]', 'xl:basis-[calc(33.333%-14px)]')}
                key={item.id}
              >
                <ReviewSummaryCard
                  author={item.author}
                  content={item.content}
                  thumbnailSrc={item.thumbnailSrc}
                  title={item.title}
                  updatedAt={item.updatedAt}
                  onClick={item.handleClick}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-6 flex justify-end gap-2">
            <CarouselPrevious className="static h-10 w-10 translate-y-0" />
            <CarouselNext className="static h-10 w-10 translate-y-0" />
          </div>
        </Carousel>
      </FadeInWhenVisible>

      {/* 모바일버전, width:768px 미만: CSS scroll-snap */}
      <FadeInWhenVisible delay={0.2}>
        <div className="md:hidden">
          <div
            aria-label="고운황금손 이용후기 목록"
            className={cn('no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2')}
            role="region"
          >
            {/* 모바일: 스크롤 목록은 최대 10개 */}
            {reviewItems.slice(0, 10).map(item => (
              <div className="w-[280px] shrink-0 snap-start" key={item.id}>
                <ReviewSummaryCard
                  author={item.author}
                  content={item.content}
                  thumbnailSrc={item.thumbnailSrc}
                  title={item.title}
                  updatedAt={item.updatedAt}
                  onClick={item.handleClick}
                />
              </div>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>
    </div>
  );
};
