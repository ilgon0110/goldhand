import Image from 'next/image';
import type { Timestamp } from 'firebase/firestore';

import { cn } from '@/lib/utils';
import DefaultImage from '@/src/shared/ui/DefaultImage';
import { formatDateToYMD } from '@/src/shared/utils';

type TReviewSummaryCardProps = {
  title: string;
  author: string;
  updatedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  content: string;
  thumbnailSrc: string | null;
  onClick: () => void;
};

export const ReviewSummaryCard = ({
  title,
  author,
  updatedAt,
  content,
  thumbnailSrc,
  onClick: handleClick,
}: TReviewSummaryCardProps) => {
  return (
    <button
      aria-label={title}
      className={cn(
        'flex w-full flex-col rounded-lg border border-slate-100 bg-white p-4 text-left shadow',
        'transition-all hover:border-gold/40 hover:shadow-md',
      )}
      type="button"
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          {thumbnailSrc ? (
            <Image
                alt={title}
                className="h-14 w-14 rounded-md object-cover"
                height={56}
                loading="lazy"
                sizes="56px"
                src={thumbnailSrc}
                width={56}
              />
          ) : (
            <DefaultImage className="h-14 w-14" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold leading-tight">{title}</p>
          <p className="mt-0.5 text-xs text-gray-500">
            <span>{author}</span>
            {' · '}
            {formatDateToYMD(updatedAt)}
          </p>
        </div>
      </div>
      <div className="mt-3 flex-1">
        <span className="block text-3xl font-bold leading-none text-gold/30"></span>
        <p className="line-clamp-2 text-sm text-gray-600">{content}</p>
      </div>
      <div className="mt-3 flex justify-end">
        <svg
          aria-hidden="true"
          className="h-4 w-4 text-gold"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.6}
          viewBox="0 0 24 24"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </button>
  );
};
