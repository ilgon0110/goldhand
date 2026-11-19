import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { GET as reviewDetailGET } from '@/app/api/review/detail/route';
import { GET as viewCountGET } from '@/app/api/viewCount/route';
import { routeGet } from '@/app/lib/routeGet';
import { throwNotFoundOn404 } from '@/app/lib/throwNotFoundOn404';
import { makeQueryClient } from '@/src/app/providers/get-query-client';
import { reviewDetailQueryOptions } from '@/src/entities/review';
import { viewCountQueryOptions } from '@/src/entities/viewCount';

import { ReviewDetailPage } from './ui/ReviewDetailPage';

type TPageProps = {
  params: Promise<{ docId: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { docId } = await params;
  const queryClient = makeQueryClient();

  // 조회수는 await하지 않는다(pending으로 dehydrate돼 스트리밍). 본문은 404 판정을 위해 await한다.
  void queryClient.prefetchQuery(viewCountQueryOptions(docId, routeGet(viewCountGET)));
  await queryClient.fetchQuery(reviewDetailQueryOptions(docId, routeGet(reviewDetailGET))).catch(throwNotFoundOn404);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReviewDetailPage docId={docId} />
    </HydrationBoundary>
  );
}
