'use client';

import { useQueryStates } from 'nuqs';

import { ReviewCard, useGetReviewListData } from '@/src/entities/review';
import { franchiseeList } from '@/src/shared/config';
import { reviewParams } from '@/src/shared/lib/nuqs/searchParams';
import CustomPagination from '@/src/shared/ui/CustomPagination/CustomPagination';
import { EmptyState } from '@/src/shared/ui/empty-state';
import { ReviewPageHeader } from '@/src/widgets/review';

export const ReviewPage = () => {
  const [reviewParam, setReviewParam] = useQueryStates(reviewParams, {
    clearOnDefault: false,
    shallow: false,
  });

  const { data } = useGetReviewListData({ page: reviewParam.page, franchisee: reviewParam.franchisee });

  return (
    <>
      <ReviewPageHeader
        franchiseeList={franchiseeList}
        handleFranchiseeChange={value => setReviewParam({ franchisee: value })}
        totalDataLength={data.totalDataLength}
      />
      {data.reviewData.length > 0 ? (
        data.reviewData.map(review => <ReviewCard key={review.id} review={review} />)
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
