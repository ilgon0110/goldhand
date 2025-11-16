import type { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { Skeleton } from '@/src/shared/ui/skeleton';
import TruncateText from '@/src/shared/ui/TruncateText';
import { formatDateToYMD } from '@/src/shared/utils';

type TEventCardProps = {
  title: string;
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  id: string;
  description: string;
  thumbnail: string;
  viewMode?: 'CARD' | 'TABLE';
  handleClick: () => void;
  rowNumber: number;
};

export const EventCard = ({
  id,
  title,
  createdAt,
  description,
  thumbnail,
  viewMode = 'TABLE',
  handleClick,
  rowNumber,
}: TEventCardProps) => {
  const isCard = viewMode === 'CARD';
  const rootClass = cn(
    'transition-all duration-300 ease-in-out',
    isCard
      ? 'relative h-[266px] w-full rounded-md border-2 border-slate-200 hover:border-slate-500 flex flex-col overflow-hidden'
      : 'h-24 w-full flex flex-row gap-3 group-hover:bg-slate-100 p-4 overflow-hidden',
  );

  const imageWrapperClass = cn(isCard ? 'relative w-full p-1' : 'relative aspect-square h-full');

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Skeleton UI
    return <Skeleton className={rootClass} />;
  }

  return (
    <div
      className={cn(
        'group flex flex-row items-center border-b border-gray-200 transition-all duration-300 ease-in-out',
        'hover:cursor-pointer hover:bg-slate-100',
      )}
    >
      {viewMode === 'TABLE' && <span className="px-2 text-lg">{rowNumber}</span>}
      <button className={rootClass} data-testid={id} onClick={handleClick}>
        <div className={imageWrapperClass} data-testid={`${id}-${isCard ? 'card' : 'table'}-review`}>
          <img
            alt="리뷰썸네일이미지"
            height={0}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            src={thumbnail === '' ? '/default_image.png' : thumbnail}
            style={{
              objectFit: 'contain',
              width: isCard ? '100%' : 'auto',
              height: isCard ? 200 : '100%',
              borderRadius: isCard ? '4px' : '0',
              border: isCard ? '1px solid #e2e8f0' : 'none',
            }}
            width={0}
          />
        </div>
        <div className={isCard ? 'mt-2 flex flex-col text-start' : 'flex flex-col text-start'}>
          <TruncateText className={cn('w-full font-bold', isCard ? 'px-4' : '')} maxLines={1} text={title} />
          <div className={cn('mt-[1px] flex w-full gap-2', isCard ? 'break-keep px-4' : '')}>
            <TruncateText className="text-sm text-gray-800" maxLines={1} text={`순번:${rowNumber}`} />
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
    </div>
  );
};
