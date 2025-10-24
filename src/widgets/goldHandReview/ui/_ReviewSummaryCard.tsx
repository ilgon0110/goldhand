import type { Timestamp } from 'firebase/firestore';

import { cn } from '@/lib/utils';
import { Button } from '@/src/shared/ui/button';
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
    <div className={cn('flex w-full flex-col rounded-lg border border-slate-100 bg-white shadow-md')}>
      <img
        alt={title}
        height={200}
        loading="lazy"
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        src={thumbnailSrc || '/default_image.png'}
        style={{ objectFit: 'contain', width: 'auto', height: 200 }}
        width={0}
      />
      <div className="flex flex-col p-6">
        <h2 className="text-xl font-bold">{<TruncateText maxLines={1} text={title} />}</h2>
        <div>
          <span className="text-sm text-gray-500">{author}</span>
          <span className="ml-2 text-sm text-gray-500">{formatDateToYMD(updatedAt)}</span>
        </div>
        <TruncateText className="text-gray-600" maxLines={1} text={content} />
        <Button className="mt-6" variant="outline" onClick={handleClick}>
          자세히 보기
        </Button>
      </div>
    </div>
  );
};
