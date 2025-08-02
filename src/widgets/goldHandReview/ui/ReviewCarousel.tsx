'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/src/shared/ui/carousel';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { generateReviewDescription, generateThumbnailUrl } from '@/src/shared/utils';
import type { IReviewData } from '@/src/views/review';

import { ReviewCard } from '../index';
import { ReviewSummaryCard } from './ReviewSummaryCard';

export const ReviewCarousel = ({ data }: { data: IReviewData['reviewData'] }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="w-full">
      {isPending && <LoadingSpinnerOverlay text="해당 후기로 이동중.." />}
      <FadeInWhenVisible>
        <div className="mb-12 flex flex-col items-center justify-center gap-6 whitespace-pre-wrap">
          <SectionTitle
            buttonTitle=""
            title="고운황금손 이용후기"
            onClickButtonTitle={() => {
              startTransition(() => {
                router.push('/review');
              });
            }}
          />
        </div>
      </FadeInWhenVisible>
      {/* 웹버전, width:640px 이상 */}
      <FadeInWhenVisible delay={0.2}>
        <Carousel
          className="hidden w-full sm:block"
          opts={{
            align: 'start',
          }}
          orientation="horizontal"
        >
          <CarouselContent className="gap-6">
            {data?.map(item => (
              <CarouselItem className="basis-1/1 md:basis-1/2 xl:basis-1/4" key={item.id}>
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
          <CarouselPrevious className="hidden md:inline-flex" />
          <CarouselNext className="hidden md:inline-flex" />
        </Carousel>
      </FadeInWhenVisible>
      {/* 모바일버전, width:640px 미만 */}
      <FadeInWhenVisible delay={0.2}>
        <div className="flex flex-col gap-3 sm:hidden">
          {data.slice(0, 3).map(item => (
            <div className="flex max-h-32 flex-row px-1" key={item.id}>
              <ReviewCard
                author={item.name}
                createdAt={item.createdAt}
                description={generateReviewDescription(item.htmlString)}
                franchisee={item.franchisee}
                handleClick={() => {
                  startTransition(() => {
                    router.push(`/review/${item.id}`);
                  });
                }}
                thumbnail={null}
                title={item.title}
              />
            </div>
          ))}
        </div>
      </FadeInWhenVisible>
    </div>
  );
};
