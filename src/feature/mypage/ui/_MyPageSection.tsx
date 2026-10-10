import type { Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import { PiCaretRight, PiTray } from 'react-icons/pi';

import { cn } from '@/lib/utils';
import CustomPagination from '@/src/shared/ui/CustomPagination/CustomPagination';

const PAGE_SIZE = 10;

function formatDotDate(timestamp: Pick<Timestamp, 'nanoseconds' | 'seconds'> | null | undefined): string {
  if (timestamp == null) return '';
  const d = new Date(timestamp.seconds * 1000);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${year}.${month}.${day}`;
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
      <div
        className={cn(
          'mt-4 flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-16 text-center',
          className,
        )}
      >
        <PiTray aria-hidden="true" className="h-8 w-8 text-gold" />
        <h3 className="mt-3 text-base font-bold text-foreground">{emptyTitle}</h3>
        {emptyDescription && <p className="mt-1 text-sm text-muted-foreground">{emptyDescription}</p>}
      </div>
    );
  }

  return (
    <div className={className}>
      {/* 패널 메타 */}
      <p className="px-1 py-4 text-sm text-muted-foreground">
        총 <span className="font-semibold tabular-nums text-foreground">{data.length}</span>건
      </p>

      {/* 리스트: 행 hover 시 둥근 배경으로 떠오른다 */}
      <ul className="m-0 list-none divide-y divide-border border-y border-border p-0">
        {pagedData?.map(item => (
          <li key={getId(item)}>
            <button
              className={cn(
                'group my-1 grid w-full cursor-pointer grid-cols-[1fr_auto] items-center gap-3 rounded-xl px-3 py-3.5 text-left transition-colors duration-200',
                'hover:bg-muted/60',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-goldDeep',
                'md:gap-6 md:px-4',
              )}
              data-testid={getId(item)}
              type="button"
              onClick={() => onClickItem(item)}
            >
              {/* 유형 + 라벨 */}
              <span className="flex min-w-0 items-center gap-2.5">
                {tag && (
                  <span
                    className={cn(
                      'hidden shrink-0 rounded-md bg-gold/10 px-2 py-0.5 text-xs font-semibold text-goldDeep',
                      'md:inline',
                    )}
                  >
                    {tag}
                  </span>
                )}
                <span className={cn('truncate text-foreground', 'md:text-[15px]')}>{getLabel(item)}</span>
              </span>

              {/* 날짜 + 화살표 */}
              <span className="flex items-center gap-3">
                <span className="whitespace-nowrap text-sm tabular-nums text-muted-foreground">
                  {formatDotDate(getDate(item))}
                </span>
                <PiCaretRight
                  aria-hidden="true"
                  className={cn(
                    'hidden h-4 w-4 text-muted-foreground transition-transform duration-200',
                    'group-hover:translate-x-0.5 group-hover:text-goldDeep',
                    'md:block',
                  )}
                />
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
