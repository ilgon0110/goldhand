'use client';

import { cn } from '@/lib/utils';
import { useGetReviewListData } from '@/src/entities/review';
import { useListQueryStates } from '@/src/feature/list-pagination';
import { franchiseeList } from '@/src/shared/config';
import { reviewParams } from '@/src/shared/lib/nuqs/searchParams';
import CustomPagination from '@/src/shared/ui/CustomPagination/CustomPagination';
import { EmptyState } from '@/src/shared/ui/empty-state';
import { ReviewCard } from '@/src/widgets/review';
import { ReviewPageHeader } from '@/src/widgets/review';

export const ReviewPage = () => {
  const [reviewParam, setReviewParam, isPending] = useListQueryStates(reviewParams);

  const { data } = useGetReviewListData({ page: reviewParam.page, franchisee: reviewParam.franchisee });

  return (
    <>
      <ReviewPageHeader
        franchiseeList={franchiseeList}
        handleFranchiseeChange={value => setReviewParam({ franchisee: value, page: 1 })}
        totalDataLength={data.totalDataLength}
      />
      <div aria-busy={isPending} className={cn('transition-opacity', isPending && 'opacity-50')}>
        {data.reviewData.length > 0 ? (
          data.reviewData.map(review => <ReviewCard key={review.id} review={review} />)
        ) : (
          <EmptyState className="mt-4" description="등록된 후기가 없습니다." title="새로운 후기를 등록해보세요" />
        )}
      </div>
      <section className="mt-6">
        <CustomPagination
          maxColumnNumber={10}
          targetPage={reviewParam.page}
          totalDataLength={data.pageableDataLength}
          onChangePage={page => setReviewParam({ page })}
        />
      </section>
    </>
  );
};
