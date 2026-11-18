import { cn } from '@/lib/utils';
import { Skeleton } from '@/src/shared/ui/skeleton';

// 스트리밍되는 홈 섹션의 fallback. 데이터가 도착했을 때 레이아웃이 크게 밀리지 않도록 높이만 실제 섹션과 맞춘다.
const HeadingSkeleton = () => (
  <div aria-hidden className="space-y-3">
    <Skeleton className={cn('h-8 w-56', 'md:h-10 md:w-72')} />
    <Skeleton className="h-4 w-48" />
  </div>
);

export const ReviewCarouselSkeleton = () => (
  <div className="w-full" role="status">
    <span className="sr-only">이용후기를 불러오는 중</span>
    <HeadingSkeleton />
    <div aria-hidden className={cn('mt-10 grid grid-cols-1 gap-5', 'md:grid-cols-2', 'xl:grid-cols-3')}>
      <Skeleton className="h-80 rounded-2xl" />
      <Skeleton className={cn('hidden h-80 rounded-2xl', 'md:block')} />
      <Skeleton className={cn('hidden h-80 rounded-2xl', 'xl:block')} />
    </div>
  </div>
);

export const PriceListSkeleton = () => (
  <div role="status">
    <span className="sr-only">이용요금을 불러오는 중</span>
    <HeadingSkeleton />
    <div aria-hidden className={cn('mt-10 grid grid-cols-1 gap-3', 'md:gap-5', 'lg:grid-cols-[1.1fr_1fr]')}>
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton className="h-36 rounded-2xl" key={index} />
      ))}
    </div>
  </div>
);
