import type { SearchParams } from 'nuqs/server';

import { getEventListData } from '@/src/entities/event';
import { getUserData } from '@/src/shared/api/getUserData';
import { loadEventParams } from '@/src/shared/lib/nuqs/searchParams';

import { EventPage } from './ui/EventPage';

type TPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: TPageProps) {
  const { page, status } = await loadEventParams(searchParams);
  const eventData = await getEventListData(page, status);
  const userData = await getUserData();

  return (
    <EventPage
      eventData={eventData.eventData}
      totalDataLength={eventData.totalDataLength}
      userData={userData.userData}
    />
  );
}
