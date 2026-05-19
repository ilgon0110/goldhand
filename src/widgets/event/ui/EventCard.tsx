import type { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import DefaultImage from '@/src/shared/ui/DefaultImage';
import { Skeleton } from '@/src/shared/ui/skeleton';
import TruncateText from '@/src/shared/ui/TruncateText';
import { formatDateToYMD } from '@/src/shared/utils';

type TEventCardProps = {
  title: string;
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  id: string;
  description: string;
  thumbnail: string | null;
  handleClick: () => void;
  rowNumber: number;
};

export const EventCard = ({
  id,
  title,
  createdAt,
  description,
  thumbnail,
  handleClick,
  rowNumber,
}: TEventCardProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const innerClass = 'h-24 w-full flex flex-row gap-3 p-4 overflow-hidden transition-all duration-300 ease-in-out';

  if (!isMounted) {
    return <Skeleton className={innerClass} />;
  }

  return (
    <div
      className={cn(
        'group flex flex-row items-center border-b border-gray-200 transition-all duration-300 ease-in-out',
        'hover:cursor-pointer hover:bg-slate-100',
      )}
    >
      <span className="px-2 text-lg">{rowNumber}</span>
      <button className={innerClass} data-testid={id} onClick={handleClick}>
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
        <div className="flex flex-col text-start">
          <TruncateText className="w-full font-bold" maxLines={1} text={title} />
          <div className="mt-[1px] flex w-full gap-2">
            <TruncateText className="text-sm text-gray-800" maxLines={1} text={`순번:${rowNumber}`} />
            <TruncateText className="text-sm text-gray-500" maxLines={1} text={formatDateToYMD(createdAt)} />
          </div>
          <TruncateText
            className="text-start text-sm text-gray-800"
            maxLines={1}
            text={description === '' ? '이벤트 내용이 없습니다.' : description}
          />
        </div>
      </button>
    </div>
  );
};
