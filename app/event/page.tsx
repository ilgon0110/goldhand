import type { SearchParams } from 'nuqs/server';
import { Suspense } from 'react';

import { getUserData } from '@/src/shared/api/getUserData';
import { loadEventParams } from '@/src/shared/lib/nuqs/searchParams';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { EventPage, getEventListData } from '@/src/views/event';

type TPageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: TPageProps) {
  const { page, status } = await loadEventParams(searchParams);
  const eventData = await getEventListData(page, status);
  const userData = await getUserData();

  return (
    <Suspense fallback={<LoadingSpinnerOverlay text="이벤트 페이지 로딩중.." />}>
      <EventPage
        eventData={eventData.eventData}
        totalDataLength={eventData.totalDataLength}
        userData={userData.userData}
      />
    </Suspense>
  );
}
