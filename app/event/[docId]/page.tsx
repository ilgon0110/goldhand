import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { getEventDetailData } from '@/src/entities/event';
import { getUserData } from '@/src/shared/api/getUserData';
import { getViewCountData } from '@/src/shared/api/getViewCountData';
import { eventKeys, userKeys, viewCountKeys } from '@/src/shared/config/queryKeys';

import { EventDetailPage } from './ui/EventDetailPage';

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

  await Promise.all([
    queryClient.prefetchQuery({ queryKey: userKeys.all, queryFn: getUserData }),
    queryClient.prefetchQuery({
      queryKey: viewCountKeys.detail(docId),
      queryFn: () => getViewCountData({ docId }),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventDetailPage docId={docId} />
    </HydrationBoundary>
  );
}
