'use client';

import { useRouter } from 'next/navigation';
import { useQueryStates } from 'nuqs';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';
import { generateReviewDescription, ReviewCard } from '@/src/entities/review';
import { franchiseeList } from '@/src/shared/config';
import { reviewParams } from '@/src/shared/lib/nuqs/searchParams';
import type { IReviewListResponseData } from '@/src/shared/types';
import CustomPagination from '@/src/shared/ui/CustomPagination/CustomPagination';
import { EmptyState } from '@/src/shared/ui/empty-state';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';
import { sendViewLog } from '@/src/shared/utils/verifyViewId';
import { ReviewPageHeader } from '@/src/widgets/review';

export const ReviewPage = ({ data, isLogin }: { data: IReviewListResponseData; isLogin: boolean }) => {
  const router = useRouter();
  const [reviewParam, setReviewParam] = useQueryStates(reviewParams, {
    clearOnDefault: false,
    shallow: false,
  });
  const [isPending, startTransition] = useTransition();

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="해당 후기로 이동중.." />}
      <SectionTitleHero description="고운황금손 산모님들의 소중한 후기를 확인해보세요" label="이용 후기" />
      <div
        className={cn(
          'flex w-full flex-col items-baseline justify-between gap-4',
          'sm:flex-row sm:items-center sm:gap-0',
        )}
      >
        <ReviewPageHeader
          franchiseeList={franchiseeList}
          handleFranchiseeChange={value => setReviewParam({ franchisee: value })}
          isLogin={isLogin}
        />
      </div>
      {data.reviewData.length > 0 ? (
        <section className="mt-6 grid grid-cols-1 gap-2">
          {data.reviewData.map(review => (
            <ReviewCard
              author={review.name}
              createdAt={review.createdAt}
              description={generateReviewDescription(review.htmlString)}
              handleClick={() => {
                startTransition(async () => {
                  await sendViewLog(review.id);
                  router.push(`/review/${review.id}`);
                });
              }}
              id={review.id}
              key={review.id}
              thumbnail={review.thumbnail}
              title={review.title}
            />
          ))}
        </section>
      ) : (
        <EmptyState className="mt-4" description="등록된 후기가 없습니다." title="새로운 후기를 등록해보세요" />
      )}
      <section className="mt-6">
        <CustomPagination
          maxColumnNumber={10}
          targetPage={reviewParam.page}
          totalDataLength={data.totalDataLength}
          onChangePage={page => setReviewParam({ page })}
        />
      </section>
    </>
  );
};
