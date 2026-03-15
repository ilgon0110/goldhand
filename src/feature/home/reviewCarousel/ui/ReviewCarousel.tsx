'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { cn } from '@/lib/utils';
import { generateReviewDescription, generateThumbnailUrl, ReviewCard } from '@/src/entities/review';
import type { CarouselApi } from '@/src/shared/ui/carousel';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/src/shared/ui/carousel';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';

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

  return (
    <div className="w-full sm:px-20">
      {isPending && <LoadingSpinnerOverlay text="해당 후기로 이동중.." />}
      <FadeInWhenVisible>
        <div className="mb-12 flex flex-col items-center justify-center gap-6 whitespace-pre-wrap">
          <SectionTitle title="고운황금손 이용후기" />
        </div>
      </FadeInWhenVisible>
      {/* 웹버전, width:768px 이상 */}
      <FadeInWhenVisible delay={0.2}>
        <Carousel
          aria-label="고운황금손 이용후기 목록"
          className={cn('hidden w-full', 'md:block')}
          opts={{
            align: 'start',
          }}
          orientation="horizontal"
          setApi={setApi}
        >
          <CarouselContent className="gap-6">
            {data?.map((item, index) => (
              <CarouselItem
                aria-current={index === currentIndex ? 'true' : undefined}
                className={cn('basis-1/1', 'md:basis-1/2', 'xl:basis-1/3')}
                key={item.id}
              >
                <ReviewSummaryCard
                  author={item.name}
                  content={generateReviewDescription(item.htmlString)}
                  handleClick={() => {
                    startTransition(() => {
                      router.push(`/review/${item.id}`);
                    });
                  }}
                  thumbnailSrc={generateThumbnailUrl(item.htmlString)}
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
      {/* 모바일버전, width:768px 미만 */}
      <FadeInWhenVisible delay={0.2}>
        <div className={cn('flex w-full flex-col gap-3', 'md:hidden')}>
          {data?.slice(0, 3).map(item => (
            <div className={cn('flex max-h-32 w-full flex-row px-1')} key={item.id}>
              <ReviewCard
                author={item.name}
                createdAt={item.createdAt}
                description={generateReviewDescription(item.htmlString)}
                handleClick={() => {
                  startTransition(() => {
                    router.push(`/review/${item.id}`);
                  });
                }}
                id={item.id}
                thumbnail={generateThumbnailUrl(item.htmlString)}
                title={item.title}
              />
            </div>
          ))}
        </div>
      </FadeInWhenVisible>
    </div>
  );
};
