import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import type { SearchParams } from 'nuqs/server';

import { GET as eventListGET } from '@/app/api/event/route';
import { routeGet } from '@/app/lib/routeGet';
import { eventListQueryOptions } from '@/src/entities/event';
import { loadEventParams } from '@/src/shared/lib/nuqs/searchParams';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

import { EventPage } from './ui/EventPage';

type TPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: TPageProps) {
  const { page, status } = await loadEventParams(searchParams);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(eventListQueryOptions({ page, status }, routeGet(eventListGET)));

  return (
    <>
      <SectionTitleHero label="고운황금손 소식" />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EventPage />
      </HydrationBoundary>
    </>
  );
}
