'use client';

import { useRouter } from 'next/navigation';
import { useQueryStates } from 'nuqs';
import { useEffect, useState, useTransition } from 'react';

import { cn } from '@/lib/utils';
import { franchiseeList } from '@/src/shared/config';
import { useMediaQuery } from '@/src/shared/hooks/useMediaQuery';
import { reviewParams } from '@/src/shared/lib/nuqs/searchParams';
import type { IReviewListResponseData } from '@/src/shared/types';
import { EmptyState } from '@/src/shared/ui/empty-state';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { sendViewLog } from '@/src/shared/utils/verifyViewId';
import { generateReviewDescription } from '@/src/widgets/goldHandReview';
import { ReviewCard } from '@/src/widgets/goldHandReview';
import { WidgetPagination } from '@/src/widgets/Pagination';
import { ReviewPageHeader } from '@/src/widgets/review';

export const ReviewPage = ({ data, isLogin }: { data: IReviewListResponseData; isLogin: boolean }) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'CARD' | 'TABLE'>('CARD');
  const [reviewParam, setReviewParam] = useQueryStates(reviewParams, {
    clearOnDefault: false,
    shallow: false,
  });
  const [isPending, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    if (!isDesktop) {
      // 모바일 화면에서는 무조건 TABLE 모드로 설정
      setViewMode('TABLE');
    } else {
      // 데스크탑 화면에서는 기본적으로 CARD 모드로 설정
      setViewMode('CARD');
    }
  }, [isDesktop]);

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="해당 후기로 이동중.." />}
      <SectionTitle title="이용 후기" />
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
          setViewMode={setViewMode}
          viewMode={viewMode}
        />
      </div>
      {data.reviewData.length > 0 ? (
        <section
          className={cn(
            'mt-6 grid gap-2',
            viewMode === 'TABLE' ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
          )}
        >
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
              viewMode={viewMode}
            />
          ))}
        </section>
      ) : (
        <EmptyState className="mt-4" description="등록된 후기가 없습니다." title="새로운 후기를 등록해보세요" />
      )}
      <section className="mt-6">
        <WidgetPagination
          maxColumnNumber={10}
          targetPage={reviewParam.page}
          totalDataLength={data.totalDataLength}
          onChangePage={page => setReviewParam({ page })}
        />
      </section>
    </>
  );
};
