'use client';

import type { Timestamp } from 'firebase/firestore';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/src/shared/ui/skeleton';
import TruncateText from '@/src/shared/ui/TruncateText';
import { formatDateToYMD } from '@/src/shared/utils';

type TReviewCardProps = {
  title: string;
  author: string;
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  id: string;
  description: string;
  thumbnail: string;
  viewMode?: 'CARD' | 'TABLE';
  handleClick: () => void;
};

export const ReviewCard = ({
  id,
  title,
  author,
  createdAt,
  description,
  thumbnail,
  viewMode = 'TABLE',
  handleClick,
}: TReviewCardProps) => {
  const isCard = viewMode === 'CARD';
  const rootClass = cn(
    'transition-all duration-300 ease-in-out',
    isCard
      ? 'relative h-[266px] w-full rounded-md border-2 border-slate-200 hover:border-slate-500 flex flex-col overflow-hidden'
      : 'h-24 w-full flex flex-row gap-3 border-b border-gray-200 hover:bg-slate-100 p-4 overflow-hidden',
  );

  const imageWrapperClass = cn(isCard ? 'relative w-full p-1 h-[200px]' : 'relative aspect-square h-full');

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Skeleton UI
    return <Skeleton className={rootClass} />;
  }

  return (
    <button className={rootClass} data-testid={id} onClick={handleClick}>
      <div className={imageWrapperClass} data-testid={`${id}-${isCard ? 'card' : 'table'}-review`}>
        <Image
          alt="리뷰썸네일이미지"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          src={thumbnail === '' ? '/default_image.png' : thumbnail}
          style={{
            objectFit: 'contain',
            borderRadius: isCard ? '4px' : '0',
            border: isCard ? '1px solid #e2e8f0' : 'none',
          }}
          unoptimized
        />
      </div>
      <div className={isCard ? 'mt-2 flex flex-col text-start' : 'flex flex-col text-start'}>
        <TruncateText className={cn('w-full font-bold', isCard ? 'px-4' : '')} maxLines={1} text={title} />
        <div className={cn('mt-[1px] flex w-full gap-2', isCard ? 'break-keep px-4' : '')}>
          <TruncateText className="text-sm text-gray-800" maxLines={1} text={author} />
          <TruncateText className="text-sm text-gray-500" maxLines={1} text={formatDateToYMD(createdAt)} />
        </div>
        {!isCard && (
          <TruncateText
            className={cn(isCard ? 'hidden' : 'text-start text-sm text-gray-800')}
            maxLines={isCard ? 0 : 1}
            text={description === '' ? '리뷰 내용이 없습니다.' : description}
          />
        )}
      </div>
    </button>
  );
};
