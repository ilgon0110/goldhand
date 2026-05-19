'use client';

import type { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import DefaultImage from '@/src/shared/ui/DefaultImage';
import { Skeleton } from '@/src/shared/ui/skeleton';
import TruncateText from '@/src/shared/ui/TruncateText';
import { formatDateToYMD } from '@/src/shared/utils';

type TReviewCardProps = {
  title: string;
  author: string;
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  id: string;
  description: string;
  thumbnail: string | null;
  handleClick: () => void;
};

export const ReviewCard = ({
  id,
  title,
  author,
  createdAt,
  description,
  thumbnail,
  handleClick,
}: TReviewCardProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const rootClass = 'h-24 w-full flex flex-row gap-3 group-hover:bg-slate-100 p-4 overflow-hidden transition-all duration-300 ease-in-out';

  if (!isMounted) {
    return <Skeleton className={rootClass} />;
  }

  return (
    <button className={rootClass} data-testid={id} onClick={handleClick}>
      <div className="relative aspect-square h-full" data-testid={`${id}-table-review`}>
        {thumbnail == null ? (
          <DefaultImage
            style={{ width: 'auto', height: '100%', borderRadius: '0', border: 'none' }}
          />
        ) : (
          <img
            alt={`${title} 썸네일`}
            height={0}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            src={thumbnail}
            style={{ objectFit: 'contain', width: 'auto', height: '100%', borderRadius: '0', border: 'none' }}
            width={0}
          />
        )}
      </div>
      <div className={cn('flex flex-col text-start')}>
        <TruncateText className="w-full font-bold" maxLines={1} text={title} />
        <div className="mt-[1px] flex w-full gap-2">
          <TruncateText className="text-sm text-gray-800" maxLines={1} text={author} />
          <TruncateText className="text-sm text-gray-500" maxLines={1} text={formatDateToYMD(createdAt)} />
        </div>
        <TruncateText
          className="text-start text-sm text-gray-800"
          maxLines={1}
          text={description === '' ? '리뷰 내용이 없습니다.' : description}
        />
      </div>
    </button>
  );
};
