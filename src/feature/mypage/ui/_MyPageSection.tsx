import type { Timestamp } from 'firebase/firestore';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import CustomPagination from '@/src/shared/ui/CustomPagination/CustomPagination';
import { WithEmptyState } from '@/src/shared/ui/WithEmptyState';
import { formatDateToYMD } from '@/src/shared/utils';

const PAGE_SIZE = 10;

interface IMyPageSectionProps<T> {
  icon: React.ReactNode;
  title: string;
  data: T[] | null;
  emptyTitle: string;
  emptyDescription: string;
  getId: (item: T) => number | string;
  getLabel: (item: T) => string;
  getDate: (item: T) => Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  onClickItem: (item: T) => void;
  className?: string;
}

export const MyPageSection = <T,>({
  icon,
  title,
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

  return (
    <div className={className}>
      <div className="relative mt-6 flex flex-row items-center gap-3">
        {icon}
        <span className="text-base font-bold md:text-2xl">{title}</span>
      </div>
      <div className="mt-2 h-[1px] w-full bg-black" />
      <WithEmptyState data={data} emptyDescription={emptyDescription} emptyTitle={emptyTitle}>
        {pagedData?.map(item => (
          <div className="mt-3 flex flex-row justify-between" data-testid={getId(item)} key={getId(item)}>
            <button
              className={cn(
                'text-base font-medium text-slate-700 transition-all ease-in-out',
                'md:text-xl',
                'hover:cursor-pointer hover:text-black hover:underline',
              )}
              onClick={() => onClickItem(item)}
            >
              {getLabel(item)}
            </button>
            <span className="text-slate-500">{formatDateToYMD(getDate(item))}</span>
          </div>
        ))}
        {data != null && data?.length > PAGE_SIZE && (
          <CustomPagination
            maxColumnNumber={PAGE_SIZE}
            targetPage={page}
            totalDataLength={data?.length}
            onChangePage={page => setPage(page)}
          />
        )}
      </WithEmptyState>
    </div>
  );
};
