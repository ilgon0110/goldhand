import type { Timestamp } from 'firebase/firestore';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import CustomPagination from '@/src/shared/ui/CustomPagination/CustomPagination';

const PAGE_SIZE = 10;

const ArrowRight = () => (
  <svg className="block h-[14px] w-[14px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function formatDotDate(timestamp: Pick<Timestamp, 'nanoseconds' | 'seconds'> | null | undefined): string {
  if (timestamp == null) return '';
  const d = new Date(timestamp.seconds * 1000);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${year} · ${month} · ${day}`;
}

interface IMyPageSectionProps<T> {
  title: string;
  tag?: string;
  data: T[] | null;
  emptyTitle: string;
  emptyDescription: string;
  getId: (item: T) => number | string;
  getLabel: (item: T) => string;
  getDate: (item: T) => Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  onClickItem: (item: T) => void;
  icon?: React.ReactNode;
  className?: string;
}

export const MyPageSection = <T,>({
  tag,
  data,
  emptyTitle,
  emptyDescription,
  getId,
  getLabel,
  getDate,
  onClickItem,
  className,
}: IMyPageSectionProps<T>) => {
  const [page, setPage] = useState(1);
  const pagedData = data?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (data == null || data.length === 0) {
    return (
      <div className={cn('mt-4 border border-dashed border-stone-200 bg-white/60 px-6 py-20 text-center', className)}>
        <div className="mb-3 font-serif text-3xl leading-none text-gold/50">○</div>
        <h3 className="mb-1.5 font-serif text-lg font-medium text-stone-900">{emptyTitle}</h3>
        {emptyDescription && <p className="text-[13px] text-stone-400">{emptyDescription}</p>}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 패널 메타 */}
      <div
        className={cn(
          'flex items-baseline justify-between px-1 py-3.5',
          'text-[12px] tracking-[0.06em] text-stone-400',
        )}
      >
        <span>총 {data.length}건</span>
      </div>

      {/* 리스트 */}
      <ul className="m-0 list-none border-t border-stone-100 p-0">
        {pagedData?.map((item, index) => (
          <li key={getId(item)}>
            <button
              className={cn(
                'grid w-full cursor-pointer items-center border-b border-stone-100 text-left transition-colors duration-150',
                'grid-cols-[32px_1fr_auto] gap-3 px-1 py-4',
                'md:grid-cols-[56px_1fr_auto] md:gap-5 md:px-2 md:py-5',
                'hover:bg-stone-50 [&:hover_.row-arrow]:translate-x-1 [&:hover_.row-arrow]:text-gold',
              )}
              data-testid={getId(item)}
              type="button"
              onClick={() => onClickItem(item)}
            >
              {/* 번호 */}
              <span
                className={cn(
                  'font-serif text-[11px] tracking-[0.1em] text-gold',
                  'md:text-[13px] md:tracking-[0.16em]',
                )}
              >
                {String((page - 1) * PAGE_SIZE + index + 1).padStart(2, '0')}
              </span>

              {/* 라벨 */}
              <span
                className={cn(
                  'flex min-w-0 items-center gap-2.5',
                  'text-[14px] leading-relaxed tracking-[-0.005em] text-stone-700',
                  'md:text-[15px]',
                )}
              >
                {tag && (
                  <span
                    className={cn(
                      'hidden shrink-0 bg-stone-100 px-2 py-[3px]',
                      'text-[10px] font-medium tracking-[0.14em] text-stone-500',
                      'md:inline',
                    )}
                  >
                    {tag}
                  </span>
                )}
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">{getLabel(item)}</span>
              </span>

              {/* 날짜 + 화살표 */}
              <span className="flex items-center gap-4">
                <span
                  className={cn(
                    'whitespace-nowrap font-serif tracking-[0.04em] text-stone-400',
                    'text-[11px]',
                    'md:text-[13px]',
                  )}
                >
                  {formatDotDate(getDate(item))}
                </span>
                <span className="row-arrow hidden text-stone-300 transition-all duration-200 md:block">
                  <ArrowRight />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* 페이지네이션 */}
      {data != null && data.length > PAGE_SIZE && (
        <CustomPagination
          maxColumnNumber={PAGE_SIZE}
          targetPage={page}
          totalDataLength={data.length}
          onChangePage={p => setPage(p)}
        />
      )}
    </div>
  );
};
