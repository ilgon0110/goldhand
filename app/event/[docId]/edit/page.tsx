import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getEventDetailData } from '@/src/entities/event';
import { eventKeys } from '@/src/shared/config/queryKeys';
import { ImagesContext } from '@/src/widgets/editor/context/ImagesContext';

import { EventEditPage } from './ui/EventEditPage';

type TPageProps = {
  params: Promise<{ docId: string }>;
};

export default async function Page({ params }: TPageProps) {
  const { docId } = await params;
  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: eventKeys.detail(docId),
    queryFn: () => getEventDetailData({ docId }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ImagesContext>
        <EventEditPage docId={docId} />
      </ImagesContext>
    </HydrationBoundary>
  );
}
