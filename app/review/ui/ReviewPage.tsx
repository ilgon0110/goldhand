'use client';

import { useQueryStates } from 'nuqs';

import { ReviewCard } from '@/src/entities/review';
import { franchiseeList } from '@/src/shared/config';
import { reviewParams } from '@/src/shared/lib/nuqs/searchParams';
import type { IReviewListResponseData } from '@/src/shared/types';
import CustomPagination from '@/src/shared/ui/CustomPagination/CustomPagination';
import { EmptyState } from '@/src/shared/ui/empty-state';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';
import { ReviewPageHeader } from '@/src/widgets/review';

export const ReviewPage = ({ data, isLogin }: { data: IReviewListResponseData; isLogin: boolean }) => {
  const [reviewParam, setReviewParam] = useQueryStates(reviewParams, {
    clearOnDefault: false,
    shallow: false,
  });

  return (
    <>
      <SectionTitleHero description="고운황금손 산모님들의 소중한 후기를 확인해보세요" label="이용 후기" />
      <ReviewPageHeader
        franchiseeList={franchiseeList}
        handleFranchiseeChange={value => setReviewParam({ franchisee: value })}
        isLogin={isLogin}
        totalDataLength={data.totalDataLength}
      />
      {data.reviewData.length > 0 ? (
        <section className="mt-2">
          {data.reviewData.map(review => (
            <ReviewCard key={review.id} review={review} />
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
