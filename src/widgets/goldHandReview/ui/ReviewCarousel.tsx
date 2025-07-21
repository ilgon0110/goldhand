'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/src/shared/ui/carousel';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { generateReviewDescription, generateThumbnailUrl } from '@/src/shared/utils';
import type { IReviewData } from '@/src/views/review';

import { ReviewCard } from '../index';

export const ReviewCarousel = ({ data }: { data: IReviewData['reviewData'] }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="w-full">
      {isPending && <LoadingSpinnerOverlay text="해당 후기로 이동중.." />}
      {/* 모바일버전, width:640px 미만 */}
      <div className="mb-12 flex flex-col items-center justify-center gap-6 whitespace-pre-wrap">
        <SectionTitle
          buttonTitle="이용후기 보러가기"
          title={`소중한 산모님들이 남긴\n\n고운황금손 이용후기 입니다.`}
          onClickButtonTitle={() => {
            startTransition(() => {
              router.push('/review');
            });
          }}
        />
      </div>
      {/* 웹버전, width:640px 이상 */}
      <div className="hidden px-0 sm:block">
        <Carousel
          className="w-full"
          opts={{
            align: 'start',
          }}
          orientation="horizontal"
        >
          <CarouselContent>
            {data?.map(item => (
              <CarouselItem className="basis-1/1 sm:basis-1/3" key={item.id}>
                <div className="flex flex-row px-1">
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
                    thumbnail={generateThumbnailUrl(item.htmlString)}
                    title={item.title}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:inline-flex" />
          <CarouselNext className="hidden md:inline-flex" />
        </Carousel>
      </div>
      {/* 모바일버전, width:640px 미만 */}
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
    </div>
  );
};
