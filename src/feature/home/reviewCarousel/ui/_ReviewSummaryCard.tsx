import type { Timestamp } from 'firebase/firestore';

import { cn } from '@/lib/utils';
import DefaultImage from '@/src/shared/ui/DefaultImage';
import TruncateText from '@/src/shared/ui/TruncateText';
import { formatDateToYMD } from '@/src/shared/utils';

type TReviewSummaryCardProps = {
  title: string;
  author: string;
  updatedAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  content: string;
  thumbnailSrc: string | null;
  handleClick: () => void;
};

export const ReviewSummaryCard = ({
  title,
  author,
  updatedAt,
  content,
  thumbnailSrc,
  handleClick,
}: TReviewSummaryCardProps) => {
  return (
    <button
      className={cn(
        'flex w-full flex-col rounded-lg border border-slate-100 bg-white p-4 shadow text-left',
        'hover:border-gold/40 hover:shadow-md transition-all',
      )}
      type="button"
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          {thumbnailSrc ? (
            <img
              alt={title}
              className="h-14 w-14 rounded-md object-cover"
              loading="lazy"
              src={thumbnailSrc}
            />
          ) : (
            <DefaultImage style={{ width: 56, height: 56 }} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold leading-tight">
            <TruncateText maxLines={1} text={title} />
          </h2>
          <p className="mt-0.5 text-xs text-gray-500">
            <span>{author}</span>
            {' · '}
            {formatDateToYMD(updatedAt)}
          </p>
        </div>
      </div>
      <div className="mt-3 flex-1">
        <span className="block text-3xl font-bold leading-none text-gold/30">"</span>
        <TruncateText className="text-sm text-gray-600" maxLines={2} text={content} />
      </div>
      <div className="mt-3 flex justify-end">
        <svg
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
