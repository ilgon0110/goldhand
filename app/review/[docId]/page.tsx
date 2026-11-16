import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { GET as reviewDetailGET } from '@/app/api/review/detail/route';
import { GET as userGET } from '@/app/api/user/route';
import { GET as viewCountGET } from '@/app/api/viewCount/route';
import { reviewDetailQueryOptions } from '@/src/entities/review';
import { userQueryOptions } from '@/src/entities/user';
import { viewCountQueryOptions } from '@/src/entities/viewCount';
import { routeGet, throwNotFoundOn404 } from '@/src/shared/lib/server/routeGet';

import { ReviewDetailPage } from './ui/ReviewDetailPage';

type TPageProps = {
  params: Promise<{ docId: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { docId } = await params;
  const queryClient = new QueryClient();

  await queryClient.fetchQuery(reviewDetailQueryOptions(docId, routeGet(reviewDetailGET))).catch(throwNotFoundOn404);

  await Promise.all([
    queryClient.prefetchQuery(userQueryOptions(routeGet(userGET))),
    queryClient.prefetchQuery(viewCountQueryOptions(docId, routeGet(viewCountGET))),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReviewDetailPage docId={docId} />
    </HydrationBoundary>
  );
}
