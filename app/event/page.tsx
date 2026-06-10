import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { SearchParams } from 'nuqs/server';

import { getEventListData } from '@/src/entities/event';
import { getUserData } from '@/src/shared/api/getUserData';
import { eventKeys, userKeys } from '@/src/shared/config/queryKeys';
import { loadEventParams } from '@/src/shared/lib/nuqs/searchParams';

import { EventPage } from './ui/EventPage';

type TPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: TPageProps) {
  const { page, status } = await loadEventParams(searchParams);
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: eventKeys.list({ page, status }),
      queryFn: () => getEventListData(page, status),
    }),
    queryClient.prefetchQuery({ queryKey: userKeys.all, queryFn: getUserData }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventPage />
    </HydrationBoundary>
  );
}
