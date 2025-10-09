import type { Timestamp } from 'firebase/firestore';

import { cn } from '@/lib/utils';
import TruncateText from '@/src/shared/ui/TruncateText';
import { formatDateToYMD } from '@/src/shared/utils';

type TReviewCardProps = {
  title: string;
  author: string;
  createdAt: Pick<Timestamp, 'nanoseconds' | 'seconds'>;
  id: string;
  description: string;
  thumbnail: string | null;
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
  // Tailwind 클래스 분기
  const isCard = viewMode === 'CARD';
  const rootClass = cn(
    'transition-all duration-300 ease-in-out',
    isCard
      ? 'relative h-[266px] rounded-md border-2 border-slate-200 hover:border-slate-500 flex flex-col overflow-hidden'
      : 'h-24 w-full flex flex-row gap-3 border-b border-gray-200 hover:bg-slate-100 p-4 overflow-hidden',
  );

  const imageWrapperClass = cn(isCard ? 'relative w-full p-1' : 'relative aspect-square h-full');

  return (
    <button className={rootClass} data-testid={id} onClick={handleClick}>
      {thumbnail ? (
        <>
          <div className={imageWrapperClass} data-testid={`${id}-${isCard ? 'card' : 'table'}-review`}>
            <img
              alt="리뷰썸네일이미지"
              height={0}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              src={thumbnail}
              style={{
                objectFit: 'cover',
                width: isCard ? '100%' : 'auto',
                height: isCard ? 200 : '100%',
                borderRadius: isCard ? '4px' : '0',
                border: isCard ? '1px solid #e2e8f0' : 'none',
              }}
              width={0}
            />
          </div>
          <div className={isCard ? 'flex flex-col items-start' : 'flex flex-col text-start'}>
            <span className={cn('font-bold', isCard ? 'break-keep px-4 pt-1' : '')}>
              <TruncateText maxLines={1} text={title} />
            </span>
            <div className={cn('mt-[1px] flex w-full gap-2', isCard ? 'break-keep px-4' : '')}>
              <span className="text-sm text-gray-800">
                <TruncateText maxLines={1} text={author} />
              </span>
              <span className="text-sm text-gray-500">
                <TruncateText maxLines={1} text={formatDateToYMD(createdAt)} />
              </span>
            </div>
            <div className={cn(isCard ? '' : 'mt-2 text-start text-sm text-gray-800')}>
              <TruncateText maxLines={isCard ? 0 : 1} text={description} />
            </div>
          </div>
        </>
      ) : (
        <div className={isCard ? 'p-4' : ''} data-testid={`${id}-${isCard ? 'card' : 'table'}-review`}>
          <div className={cn('text-start font-bold', isCard ? '' : 'text-base')}>
            <TruncateText maxLines={1} text={title} />
          </div>
          <div className="mt-[1px] flex w-full gap-2 text-sm">
            <span className="text-gray-800">
              <TruncateText maxLines={1} text={author} />
            </span>
            <span className="text-gray-500">
              <TruncateText maxLines={1} text={formatDateToYMD(createdAt)} />
            </span>
          </div>
          <div className={cn('mt-2 text-start text-sm text-gray-800', isCard ? '' : '')}>
            <TruncateText maxLines={isCard ? 6 : 1} text={description} />
          </div>
        </div>
      )}
    </button>
  );
};
