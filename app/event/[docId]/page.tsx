import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { GET as eventDetailGET } from '@/app/api/event/detail/route';
import { GET as userGET } from '@/app/api/user/route';
import { GET as viewCountGET } from '@/app/api/viewCount/route';
import { routeGet, throwNotFoundOn404 } from '@/app/lib/routeGet';
import { eventDetailQueryOptions } from '@/src/entities/event';
import { userQueryOptions } from '@/src/entities/user';
import { viewCountQueryOptions } from '@/src/entities/viewCount';

import { EventDetailPage } from './ui/EventDetailPage';

type TPageProps = {
  params: Promise<{ docId: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { docId } = await params;
  const queryClient = new QueryClient();

  await queryClient.fetchQuery(eventDetailQueryOptions(docId, routeGet(eventDetailGET))).catch(throwNotFoundOn404);

  await Promise.all([
    queryClient.prefetchQuery(userQueryOptions(routeGet(userGET))),
    queryClient.prefetchQuery(viewCountQueryOptions(docId, routeGet(viewCountGET))),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventDetailPage docId={docId} />
    </HydrationBoundary>
  );
}
