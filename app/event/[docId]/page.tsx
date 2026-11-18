import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { GET as eventDetailGET } from '@/app/api/event/detail/route';
import { GET as userGET } from '@/app/api/user/route';
import { GET as viewCountGET } from '@/app/api/viewCount/route';
import { routeGet } from '@/app/lib/routeGet';
import { throwNotFoundOn404 } from '@/app/lib/throwNotFoundOn404';
import { makeQueryClient } from '@/src/app/providers/get-query-client';
import { eventDetailQueryOptions } from '@/src/entities/event';
import { userQueryOptions } from '@/src/entities/user';
import { viewCountQueryOptions } from '@/src/entities/viewCount';

import { EventDetailPage } from './ui/EventDetailPage';

type TPageProps = {
  params: Promise<{ docId: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { docId } = await params;
  const queryClient = makeQueryClient();

  // 조회수는 await하지 않는다(pending으로 dehydrate돼 스트리밍). 본문은 404 판정을 위해 await한다.
  void queryClient.prefetchQuery(viewCountQueryOptions(docId, routeGet(viewCountGET)));
  await Promise.all([
    queryClient.fetchQuery(eventDetailQueryOptions(docId, routeGet(eventDetailGET))).catch(throwNotFoundOn404),
    queryClient.prefetchQuery(userQueryOptions(routeGet(userGET))),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventDetailPage docId={docId} />
    </HydrationBoundary>
  );
}
