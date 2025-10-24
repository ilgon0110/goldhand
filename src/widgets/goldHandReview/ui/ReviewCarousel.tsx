'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { cn } from '@/lib/utils';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/src/shared/ui/carousel';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { getReviewListData } from '@/src/views/review';
import { generateReviewDescription, generateThumbnailUrl, ReviewCard } from '@/src/widgets/goldHandReview';

import { ReviewSummaryCard } from './_ReviewSummaryCard';

export const ReviewCarousel = () => {
  const { data } = useSuspenseQuery({
    queryKey: ['reviewCarousel'],
    queryFn: () => getReviewListData(1, '전체'),
    select: data => data.reviewData,
  });
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full">
      {isPending && <LoadingSpinnerOverlay text="해당 후기로 이동중.." />}
      <FadeInWhenVisible>
        <div className="mb-12 flex flex-col items-center justify-center gap-6 whitespace-pre-wrap">
          <SectionTitle title="고운황금손 이용후기" />
        </div>
      </FadeInWhenVisible>
      {/* 웹버전, width:640px 이상 */}
      <FadeInWhenVisible delay={0.2}>
        <Carousel
          className={cn('hidden w-full', 'sm:block')}
          opts={{
            align: 'start',
          }}
          orientation="horizontal"
        >
          <CarouselContent className="gap-6">
            {data?.map(item => (
              <CarouselItem className={cn('basis-1/1', 'md:basis-1/2', 'xl:basis-1/3')} key={item.id}>
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
      {/* 모바일버전, width:640px 미만 */}
      <FadeInWhenVisible delay={0.2}>
        <div className={cn('flex w-full flex-col gap-3', 'sm:hidden')}>
          {data.slice(0, 3).map(item => (
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
