'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { generateReviewDescription } from '@/src/entities/review';
import type { IEventDetailData } from '@/src/shared/types';
import DefaultImage from '@/src/shared/ui/DefaultImage';
import { Skeleton } from '@/src/shared/ui/skeleton';
import { formatDateToYMD } from '@/src/shared/utils';
import { sendViewLog } from '@/src/shared/utils/verifyViewId';

const STATUS_CHIP: Record<IEventDetailData['status'], { label: string; cls: string; dot?: boolean }> = {
  UPCOMING: { label: '예정', cls: 'border-amber-300/40 bg-amber-50 text-amber-700' },
  ONGOING: { label: '진행중', cls: 'border-greenDeep/25 bg-greenDeep/10 text-greenDeep', dot: true },
  ENDED: { label: '종료', cls: 'border-stone-200 bg-stone-50 text-stone-400' },
};

type TEventCardProps = {
  event: IEventDetailData;
};

export const EventCard = ({ event }: TEventCardProps) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const chip = STATUS_CHIP[event.status];
  const description = generateReviewDescription(event.htmlString);
  const formattedDate = formatDateToYMD(event.createdAt);
  const isEnded = event.status === 'ENDED';

  const gridClass = cn(
    'grid w-full items-baseline border-b border-stone-200',
    'grid-cols-[28px_44px_1fr] gap-x-3 gap-y-1 px-1 py-3.5',
    'md:grid-cols-[36px_56px_1fr_auto] md:gap-x-4',
  );

  if (!isMounted) {
    return (
      <div className={gridClass}>
        {/* 순번 */}
        <Skeleton className="row-span-2 mx-auto h-[17px] w-5 self-center" />
        {/* 썸네일 */}
        <Skeleton className={cn('row-span-2 aspect-square w-11 self-center', 'md:w-14')} />
        {/* 제목 행 */}
        <div className="flex min-w-0 items-center gap-x-2">
          <Skeleton className="h-[15px] w-2/3" />
          <Skeleton className="h-4 w-10 shrink-0 rounded-full" />
        </div>
        {/* 날짜 — 데스크탑 4열 */}
        <Skeleton className="hidden h-[12px] w-20 self-start md:block" />
        {/* 미리보기 행 */}
        <Skeleton className="h-[13px] w-full" />
      </div>
    );
  }

  return (
    <button
      className={cn(gridClass, 'group text-left transition-colors duration-150 hover:bg-stone-50')}
      data-testid={event.id}
      onClick={async () => {
        await sendViewLog(event.id);
        router.push(`/event/${event.id}`);
      }}
    >
      {/* 순번 — 2행 span */}
      <div className="row-span-2 flex items-center justify-center self-center">
        <span
          className={cn(
            'font-serif text-[15px] tracking-[0.02em] text-stone-400 group-hover:text-stone-700',
            'md:text-[17px]',
          )}
        >
          {event.rowNumber}
        </span>
      </div>

      {/* 썸네일 — 2행 span */}
      <div className="row-span-2 flex items-center justify-center self-center">
        <div
          className={cn('relative aspect-square w-11 overflow-hidden bg-stone-100 ring-1 ring-stone-200', 'md:w-14')}
        >
          {event.thumbnail == null ? (
            <DefaultImage style={{ width: '100%', height: '100%', borderRadius: '0', border: 'none' }} />
          ) : (
            <Image
              alt={`${event.title} 썸네일`}
              className="absolute inset-0 h-full w-full"
              fill
              src={event.thumbnail}
              style={{ objectFit: 'cover' }}
            />
          )}
        </div>
      </div>

      {/* 제목 + 상태 chip */}
      <div className="flex min-w-0 items-baseline gap-x-3">
        <p
          className={cn(
            'min-w-0 truncate text-[15px] font-medium tracking-[-0.01em] group-hover:text-stone-900',
            isEnded ? 'text-stone-400' : 'text-stone-700',
          )}
        >
          {event.title}
        </p>
        <span
          className={cn(
            'inline-flex shrink-0 items-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[10.5px] font-medium tracking-[0.06em]',
            chip.cls,
          )}
        >
          {chip.dot && <span className="mr-1 inline-block h-1 w-1 rounded-full bg-greenDeep align-middle" />}
          {chip.label}
        </span>
      </div>

      {/* 날짜 — 데스크탑 4열 */}
      <p
        className={cn(
          'hidden self-start whitespace-nowrap font-serif text-[12.5px] tracking-[0.04em] text-stone-400',
          'md:block',
        )}
      >
        {formattedDate}
      </p>

      {/* 미리보기 + 모바일 날짜 */}
      <div className="flex min-w-0 items-center justify-between gap-2">
        <p
          className={cn(
            'min-w-0 truncate text-[13px] tracking-[-0.005em]',
            isEnded ? 'text-stone-400' : 'text-stone-500',
          )}
        >
          {description === '' ? '이벤트 내용이 없습니다.' : description}
        </p>
        <p className="shrink-0 whitespace-nowrap font-serif text-[11px] tracking-[0.04em] text-stone-400 md:hidden">
          {formattedDate}
        </p>
      </div>
    </button>
  );
};
