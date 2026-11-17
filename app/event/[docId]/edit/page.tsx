import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { GET as eventDetailGET } from '@/app/api/event/detail/route';
import { routeGet } from '@/app/lib/routeGet';
import { throwNotFoundOn404 } from '@/app/lib/throwNotFoundOn404';
import { eventDetailQueryOptions } from '@/src/entities/event';
import { ImagesContext } from '@/src/entities/image';

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
