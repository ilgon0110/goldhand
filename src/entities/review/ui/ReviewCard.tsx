'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { cn } from '@/lib/utils';
import type { IReviewDetailData } from '@/src/shared/types';
import DefaultImage from '@/src/shared/ui/DefaultImage';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { Skeleton } from '@/src/shared/ui/skeleton';
import { formatDateToYMD } from '@/src/shared/utils';
import { sendViewLog } from '@/src/shared/utils/verifyViewId';

import { generateReviewDescription } from '../lib/util';

type TReviewCardProps = {
  review: IReviewDetailData & { id: string };
};

export const ReviewCard = ({ review }: TReviewCardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);

  const description = generateReviewDescription(review.htmlString);
  const formattedDate = formatDateToYMD(review.createdAt);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const gridClass = cn(
    'grid w-full items-baseline border-b border-stone-200',
    'grid-cols-[44px_1fr] gap-x-3 gap-y-1 px-1 py-3.5',
    'md:grid-cols-[56px_1fr_auto] md:gap-x-4',
  );

  if (!isMounted) {
    return (
      <div className={gridClass}>
        {/* 썸네일 */}
        <Skeleton className={cn('row-span-2 aspect-square w-11 self-center', 'md:w-14')} />
        {/* 제목 행 */}
        <div className="flex min-w-0 items-center gap-x-2">
          <Skeleton className="h-[15px] w-2/3" />
          <Skeleton className="h-4 w-12 shrink-0 rounded-full" />
          <Skeleton className="h-4 w-10 shrink-0 rounded-full" />
        </div>
        {/* 날짜 — 데스크탑 3열 */}
        <Skeleton className="hidden h-[12px] w-20 self-start md:block" />
        {/* 미리보기 행 */}
        <Skeleton className="h-[13px] w-full" />
      </div>
    );
  }

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="페이지 이동 중..." />}
      <button
        className={cn(gridClass, 'group text-left transition-colors duration-150 hover:bg-stone-50')}
        data-testid={review.id}
        type="button"
        onClick={() => {
          startTransition(async () => {
            await sendViewLog(review.id);
            router.push(`/review/${review.id}`);
          });
        }}
      >
        {/* 썸네일 — 2행 span */}
        <div className="row-span-2 flex items-center justify-center self-center">
          <div
            className={cn('relative aspect-square w-11 overflow-hidden bg-stone-100 ring-1 ring-stone-200', 'md:w-14')}
          >
            {review.thumbnail == null ? (
              <DefaultImage style={{ width: '100%', height: '100%', borderRadius: '0', border: 'none' }} />
            ) : (
              <Image
                alt={`${review.title} 썸네일`}
                className="absolute inset-0 h-full w-full"
                fill
                src={review.thumbnail}
                style={{ objectFit: 'contain' }}
              />
            )}
          </div>
        </div>

        {/* 제목 행 */}
        <div className="flex min-w-0 items-baseline gap-x-3">
          <p className="min-w-0 truncate text-[15px] font-medium tracking-[-0.01em] text-stone-700 group-hover:text-stone-900">
            {review.title}
          </p>
          <div className="inline-flex shrink-0 items-center gap-2">
            <span className="whitespace-nowrap rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 text-[10.5px] font-medium tracking-[0.06em] text-stone-500">
              {review.franchisee}
            </span>
            <span className="whitespace-nowrap rounded-full border border-greenDeep/25 bg-greenDeep/10 px-2 py-0.5 text-[10.5px] font-medium tracking-[0.06em] text-greenDeep">
              {review.name}
            </span>
          </div>
        </div>

        {/* 날짜 — 데스크탑 3열 */}
        <p
          className={cn(
            'hidden self-start whitespace-nowrap font-serif text-[12.5px] tracking-[0.04em] text-stone-400',
            'md:block',
          )}
        >
          {formattedDate}
        </p>

        {/* 미리보기 + 모바일 날짜 행 */}
        <div className="flex min-w-0 items-center justify-between gap-2">
          <p className="min-w-0 truncate text-[13px] tracking-[-0.005em] text-stone-500">
            {description === '' ? '리뷰 내용이 없습니다.' : description}
          </p>
          <p className="shrink-0 whitespace-nowrap font-serif text-[11px] tracking-[0.04em] text-stone-400 md:hidden">
            {formattedDate}
          </p>
        </div>
      </button>
    </>
  );
};
