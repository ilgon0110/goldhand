import type { Timestamp } from 'firebase/firestore';
import { Phone } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { ViewIcon } from '@/src/shared/ui/icons/ViewIcon';
import { formatDateToYMD, isTimestampUpdated } from '@/src/shared/utils';

type TTimestamp = Pick<Timestamp, 'nanoseconds' | 'seconds'>;

type TPostDetailHeaderProps = {
  title: string;
  createdAt: TTimestamp | null | undefined;
  updatedAt?: TTimestamp | null;
  /** 지점, 순번 등 제목 위에 붙는 배지 */
  badge?: string | null;
  /** 노출 권한이 있을 때만 전달한다. 없으면 제목 아래 날짜 한 줄만 남는다. */
  author?: string | null;
  /** 이미 포맷된 전화번호. 노출 권한이 있을 때만 전달한다. */
  phoneNumber?: string | null;
  viewCount?: number | null;
  /** PinToggleButton 등 배지 옆에 놓이는 요소 */
  pin?: ReactNode;
};

export const PostDetailHeader = ({
  title,
  createdAt,
  updatedAt,
  badge,
  author,
  phoneNumber,
  viewCount,
  pin,
}: TPostDetailHeaderProps) => {
  const createdText = formatDateToYMD(createdAt);
  const dateText = isTimestampUpdated(createdAt, updatedAt)
    ? `${createdText} · 수정 ${formatDateToYMD(updatedAt)}`
    : createdText;

  const hasEyebrow = Boolean(badge) || pin != null || viewCount != null;

  return (
    <header className="flex flex-col">
      {hasEyebrow ? (
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {badge ? (
              <span
                className={cn(
                  'inline-flex items-center whitespace-nowrap rounded-full border border-gold/35 bg-cream',
                  'px-2.5 py-[3px] text-[11px] font-semibold tracking-[0.06em] text-goldDeep',
                  'md:px-3 md:py-1 md:text-[12px]',
                )}
              >
                {badge}
              </span>
            ) : null}
            {pin}
          </div>
          {viewCount == null ? null : (
            <span
              className={cn(
                'inline-flex shrink-0 items-center gap-1 tabular-nums text-stone-500',
                'text-[12.5px] tracking-[0.01em]',
                'md:text-[13px]',
              )}
            >
              <ViewIcon aria-hidden className={cn('h-3.5 w-3.5', 'md:h-[15px] md:w-[15px]')} />
              {viewCount}
            </span>
          )}
        </div>
      ) : null}

      <h1
        className={cn(
          'mt-3 text-[22px] font-bold leading-[1.35] tracking-[-0.02em] text-stone-900 first:mt-0',
          'md:mt-3.5 md:text-[32px] md:leading-[1.32] md:tracking-[-0.025em] md:first:mt-0',
        )}
      >
        {title}
      </h1>

      {author ? (
        <>
          <div className={cn('mt-[18px] h-px w-full bg-lineWarm', 'md:mt-[22px]')} />
          <div
            className={cn(
              'mt-3.5 grid items-center gap-x-3 gap-y-0.5',
              'grid-cols-[minmax(0,1fr)_auto]',
              'md:mt-4 md:grid-cols-[auto_auto_minmax(0,1fr)]',
            )}
          >
            <span
              className={cn(
                'col-start-1 row-start-1 truncate text-sm font-semibold tracking-[-0.01em] text-stone-700',
                'md:text-[15px]',
              )}
            >
              {author}
            </span>
            <span
              className={cn(
                'col-start-1 row-start-2 text-xs tabular-nums tracking-[0.01em] text-stone-500',
                'md:col-start-3 md:row-start-1 md:justify-self-end md:text-[12.5px]',
              )}
            >
              {dateText}
            </span>
            {phoneNumber ? (
              <span
                className={cn(
                  'col-start-2 row-start-1 inline-flex shrink-0 items-center gap-1.5',
                  'text-sm font-semibold tabular-nums tracking-[-0.01em] text-stone-700',
                  'md:col-start-2 md:text-[15px]',
                )}
              >
                <Phone aria-hidden className="h-3.5 w-3.5" />
                {phoneNumber}
              </span>
            ) : null}
          </div>
        </>
      ) : (
        <p className={cn('mt-2.5 text-xs tabular-nums tracking-[0.01em] text-stone-500', 'md:text-[12.5px]')}>
          {dateText}
        </p>
      )}
    </header>
  );
};
