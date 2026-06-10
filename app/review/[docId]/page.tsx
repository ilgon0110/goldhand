import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getReviewDetailData } from '@/src/entities/review';
import { getUserData } from '@/src/shared/api/getUserData';
import { getViewCountData } from '@/src/shared/api/getViewCountData';
import { reviewKeys, userKeys, viewCountKeys } from '@/src/shared/config/queryKeys';

import { ReviewDetailPage } from './ui/ReviewDetailPage';

type TPageProps = {
  params: Promise<{ docId: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { docId } = await params;
  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: reviewKeys.detail(docId),
    queryFn: () => getReviewDetailData({ docId }),
  });

  await Promise.all([
    queryClient.prefetchQuery({ queryKey: userKeys.all, queryFn: getUserData }),
    queryClient.prefetchQuery({
      queryKey: viewCountKeys.detail(docId),
      queryFn: () => getViewCountData({ docId }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReviewDetailPage docId={docId} />
    </HydrationBoundary>
  );
}
