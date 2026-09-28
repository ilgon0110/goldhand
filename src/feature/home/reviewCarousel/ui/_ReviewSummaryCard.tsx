import type { Timestamp } from 'firebase/firestore';
import Image from 'next/image';
import { PiArrowRight } from 'react-icons/pi';

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
      className={cn(
        'group flex h-full w-full flex-col rounded-2xl border border-border bg-background p-5 text-left',
        'transition-colors duration-300 ease-out',
        'hover:border-gold/50 active:scale-[0.99]',
      )}
      type="button"
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          {thumbnailSrc ? (
            <Image
              alt={title}
              className="h-14 w-14 rounded-xl object-cover"
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
          <p className="truncate text-base font-bold leading-tight">{title}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            <span>{author}</span>
            {' · '}
            {formatDateToYMD(updatedAt)}
          </p>
        </div>
      </div>
      <p className="mt-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">{content}</p>
      <div className="mt-4 flex justify-end">
        <PiArrowRight
          aria-hidden="true"
          className="h-4 w-4 text-goldDeep transition-transform duration-300 group-hover:translate-x-1"
        />
      </div>
    </button>
  );
};
