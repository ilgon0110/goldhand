// app/review/[docId]/edit/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { GET as reviewDetailGET } from '@/app/api/review/detail/route';
import { GET as userGET } from '@/app/api/user/route';
import { routeGet } from '@/app/lib/routeGet';
import { throwNotFoundOn404 } from '@/app/lib/throwNotFoundOn404';
import { ImagesContext } from '@/src/entities/image/client';
import { reviewDetailQueryOptions } from '@/src/entities/review';
import { userQueryOptions } from '@/src/entities/user';

import { ReviewEditPage } from './ui/ReviewEditPage';

type TPageProps = {
  params: Promise<{ docId: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { docId } = await params;
  const queryClient = new QueryClient();

  // ReviewEditPage·useReviewFormMutation이 useUserSuspenseQuery를 쓰므로 user도 같이 prefetch한다.
  await Promise.all([
    queryClient.fetchQuery(reviewDetailQueryOptions(docId, routeGet(reviewDetailGET))).catch(throwNotFoundOn404),
    queryClient.prefetchQuery(userQueryOptions(routeGet(userGET))),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ImagesContext>
        <ReviewEditPage docId={docId} />
      </ImagesContext>
    </HydrationBoundary>
  );
}
