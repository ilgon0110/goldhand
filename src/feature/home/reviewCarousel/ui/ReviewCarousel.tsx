'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { cn } from '@/lib/utils';
import { generateReviewDescription, generateThumbnailUrl } from '@/src/entities/review';
import type { CarouselApi } from '@/src/shared/ui/carousel';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/src/shared/ui/carousel';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

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

  return (
    <div className="w-full sm:px-20">
      {isPending && <LoadingSpinnerOverlay text="해당 후기로 이동중.." />}
      <FadeInWhenVisible>
        <div className="mb-12 flex flex-col items-center justify-center gap-6 whitespace-pre-wrap">
          <SectionTitleHero description="고운황금손 이용후기를 소개합니다." label="고운황금손 이용후기" />
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
          <CarouselContent className="gap-6">
            {reviewItems.map((item, index) => (
              <CarouselItem
                aria-current={index === currentIndex ? 'true' : undefined}
                className={cn('basis-1/1', 'md:basis-1/2', 'xl:basis-1/3')}
                key={item.id}
              >
                <ReviewSummaryCard
                  author={item.author}
                  content={item.content}
                  handleClick={item.handleClick}
                  thumbnailSrc={item.thumbnailSrc}
                  title={item.title}
                  updatedAt={item.updatedAt}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className={cn('hidden', 'md:inline-flex')} />
          <CarouselNext className={cn('hidden', 'md:inline-flex')} />
        </Carousel>
      </FadeInWhenVisible>

      {/* 모바일버전, width:768px 미만 — CSS scroll-snap */}
      <FadeInWhenVisible delay={0.2}>
        <div className={cn('-mx-4 md:hidden')}>
          <div
            aria-label="고운황금손 이용후기 목록"
            className={cn(
              'flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar px-4 pb-2',
            )}
            role="region"
          >
            {/* 모바일: 스크롤 목록은 최대 10개 */}
            {reviewItems.slice(0, 10).map(item => (
              <div className="snap-start shrink-0 w-[280px]" key={item.id}>
                <ReviewSummaryCard
                  author={item.author}
                  content={item.content}
                  handleClick={item.handleClick}
                  thumbnailSrc={item.thumbnailSrc}
                  title={item.title}
                  updatedAt={item.updatedAt}
                />
              </div>
            ))}
          </div>
        </div>
      </FadeInWhenVisible>

      {/* ALL REVIEWS 링크 */}
      <FadeInWhenVisible delay={0.3}>
        <div className="mt-7 text-center">
          <button
            className={cn(
              'inline-flex items-center gap-1.5 text-xs tracking-[0.12em] text-stone-500 transition',
              'hover:text-gold',
            )}
            type="button"
            onClick={() => startTransition(() => router.push('/review'))}
          >
            ALL REVIEWS
            <svg
              aria-hidden="true"
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </FadeInWhenVisible>
    </div>
  );
};
