'use client';

import { useRouter } from 'next/navigation';
import { useQueryStates } from 'nuqs';
import { useState, useTransition } from 'react';

import { cn } from '@/lib/utils';
import { franchiseeList } from '@/src/shared/config';
import { reviewParams } from '@/src/shared/searchParams';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { sendViewLog } from '@/src/shared/utils/verifyViewId';
import { ReviewCard } from '@/src/widgets/goldHandReview';
import { WidgetPagination } from '@/src/widgets/Pagination';
import { ReviewPageHeader } from '@/src/widgets/review';

import { type IReviewData } from '../index';
import { generateReviewDescription, generateReviewThumbnailSrc } from '../utils';

export const ReviewPage = ({ data, isLogin }: { data: IReviewData; isLogin: boolean }) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'CARD' | 'TABLE'>('CARD');
  const [reviewParam, setReviewParam] = useQueryStates(reviewParams, {
    shallow: false,
  });
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      {isPending && <LoadingSpinnerOverlay text="해당 후기로 이동중.." />}
      <SectionTitle buttonTitle="" title="이용 후기" onClickButtonTitle={() => {}} />
      <div className="flex w-full flex-col items-baseline justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
        <ReviewPageHeader
          franchiseeList={franchiseeList}
          handleFranchiseeChange={value => setReviewParam({ franchisee: value })}
          isLogin={isLogin}
          setViewMode={setViewMode}
          viewMode={viewMode}
        />
      </div>
      <section
        className={cn(
          'mt-6 grid gap-3',
          viewMode === 'TABLE' ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        )}
      >
        {data.reviewData.map(review => (
          <ReviewCard
            author={review.name}
            createdAt={review.createdAt}
            description={generateReviewDescription(review.htmlString)}
            franchisee={review.franchisee}
            handleClick={() => {
              startTransition(async () => {
                await sendViewLog(review.id);
                router.push(`/review/${review.id}`);
              });
            }}
            key={review.id}
            thumbnail={generateReviewThumbnailSrc(review.htmlString)}
            title={review.title}
            viewMode={viewMode}
          />
        ))}
      </section>
      <section className="mt-6">
        <WidgetPagination
          maxColumnNumber={10}
          targetPage={reviewParam.page}
          totalDataLength={data.totalDataLength}
          onChangePage={page => setReviewParam({ page })}
        />
      </section>
    </div>
  );
};
