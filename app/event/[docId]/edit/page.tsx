import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { GET as eventDetailGET } from '@/app/api/event/detail/route';
import { eventDetailQueryOptions } from '@/src/entities/event';
import { routeGet, throwNotFoundOn404 } from '@/src/shared/lib/server/routeGet';
import { ImagesContext } from '@/src/widgets/editor/context/ImagesContext';

import { EventEditPage } from './ui/EventEditPage';

type TPageProps = {
  params: Promise<{ docId: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { docId } = await params;
  const queryClient = new QueryClient();

  await queryClient.fetchQuery(eventDetailQueryOptions(docId, routeGet(eventDetailGET))).catch(throwNotFoundOn404);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ImagesContext>
        <EventEditPage docId={docId} />
      </ImagesContext>
    </HydrationBoundary>
  );
}
