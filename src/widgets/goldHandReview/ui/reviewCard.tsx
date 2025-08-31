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
  viewMode,
  handleClick,
}: TReviewCardProps) => {
  return (
    <>
      {/* CARD 모드 */}
      {viewMode === 'CARD' && (
        <button
          className={cn(
            'relative h-[266px] rounded-md border-2 border-slate-200 transition-all duration-300 hover:border-slate-500',
            viewMode === undefined
              ? 'hidden flex-1 flex-col overflow-hidden sm:flex'
              : viewMode === 'CARD'
                ? 'flex flex-col overflow-hidden'
                : 'hidden',
          )}
          data-testid={id}
          onClick={handleClick}
        >
          {thumbnail ? (
            <>
              <div className="relative w-full" data-testid={`${id}-card-review`}>
                <img
                  alt="리뷰썸네일이미지"
                  height={0}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  src={thumbnail}
                  style={{ objectFit: 'cover', width: '100%', height: 200 }}
                  width={0}
                />
              </div>
              <span className="break-keep px-4 pt-1 font-bold">
                <TruncateText maxLines={1} text={title} />
              </span>
              <div className="mt-[1px] flex w-full gap-2 break-keep px-4">
                <span className="text-sm text-gray-800">
                  <TruncateText maxLines={1} text={author} />
                </span>
                <span className="text-sm text-gray-500">
                  <TruncateText maxLines={1} text={formatDateToYMD(createdAt)} />
                </span>
              </div>
            </>
          ) : (
            <div className="p-4" data-testid={`${id}-card-review`}>
              <div className="text-start font-bold">
                <TruncateText maxLines={1} text={title} />
              </div>
              <div className="mt-[1px] flex w-full gap-2">
                <span className="text-sm text-gray-800">
                  <TruncateText maxLines={1} text={author} />
                </span>
                <span className="text-sm text-gray-500">
                  <TruncateText maxLines={1} text={formatDateToYMD(createdAt)} />
                </span>
              </div>
              <div className="mt-2 text-start text-sm text-gray-800">
                <TruncateText maxLines={6} text={description} />
              </div>
            </div>
          )}
        </button>
      )}
      {/* TABLE 모드 */}
      {viewMode === 'TABLE' && (
        <button
          className={cn(
            'h-24 flex-row gap-3 border-b border-gray-200 p-4',
            viewMode === undefined ? 'flex flex-1 sm:hidden' : viewMode === 'TABLE' ? 'flex overflow-hidden' : 'hidden',
          )}
          data-testid={id}
          onClick={handleClick}
        >
          {thumbnail ? (
            <>
              <div className="relative aspect-square h-full" data-testid={`${id}-table-review`}>
                <img
                  alt="리뷰썸네일이미지"
                  height={0}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  src={thumbnail}
                  style={{ objectFit: 'cover', width: 'auto', height: '100%' }}
                  width={0}
                />
              </div>
              <div className="flex flex-col text-start">
                <span className="font-bold">
                  <TruncateText maxLines={1} text={title} />
                </span>
                <div className="mt-[1px] flex w-full gap-2">
                  <span className="text-sm text-gray-800">
                    <TruncateText maxLines={1} text={author} />
                  </span>
                  <span className="text-sm text-gray-500">
                    <TruncateText maxLines={1} text={formatDateToYMD(createdAt)} />
                  </span>
                </div>
                <div className="mt-2 text-start text-sm text-gray-800">
                  <TruncateText maxLines={1} text={description} />
                </div>
              </div>
            </>
          ) : (
            <div data-testid={`${id}-table-review`}>
              <div className="text-start text-base font-bold">
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
              <div className="mt-2 text-start text-sm text-gray-800">
                <TruncateText maxLines={1} text={description} />
              </div>
            </div>
          )}
        </button>
      )}
    </>
  );
};
