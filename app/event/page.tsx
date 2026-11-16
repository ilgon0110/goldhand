import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { SearchParams } from 'nuqs/server';

import { GET as eventListGET } from '@/app/api/event/route';
import { GET as userGET } from '@/app/api/user/route';
import { eventListQueryOptions } from '@/src/entities/event';
import { userQueryOptions } from '@/src/entities/user';
import { loadEventParams } from '@/src/shared/lib/nuqs/searchParams';
import { routeGet } from '@/src/shared/lib/server/routeGet';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

import { EventPage } from './ui/EventPage';

type TPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: TPageProps) {
  const { page, status } = await loadEventParams(searchParams);
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(eventListQueryOptions({ page, status }, routeGet(eventListGET))),
    queryClient.prefetchQuery(userQueryOptions(routeGet(userGET))),
  ]);

  return (
    <>
      <SectionTitleHero label="고운황금손 소식" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EventPage />
      </HydrationBoundary>
    </>
  );
}
