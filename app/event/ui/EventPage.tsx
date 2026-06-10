'use client';

import { useQueryStates } from 'nuqs';

import { useGetEventListData } from '@/src/entities/event';
import { useGetUserData } from '@/src/entities/user';
import { eventParams } from '@/src/shared/lib/nuqs/searchParams';
import CustomPagination from '@/src/shared/ui/CustomPagination/CustomPagination';
import { EmptyState } from '@/src/shared/ui/empty-state';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';
import { EventCard, EventPageHeader } from '@/src/widgets/event';

export const EventPage = () => {
  const [eventParam, setEventParam] = useQueryStates(eventParams, {
    clearOnDefault: false,
    shallow: false,
  });

  const { data } = useGetEventListData({ page: eventParam.page, status: eventParam.status });
  const { data: userResponse } = useGetUserData();

  return (
    <>
      <SectionTitleHero label="고운황금손 이벤트" />
      <EventPageHeader isAdmin={userResponse.userData?.grade === 'admin'} totalDataLength={data.totalDataLength} />
      {data.eventData.length > 0 ? (
        <section className="mt-2">
          {data.eventData.map(event => (
            <EventCard event={event} key={event.id} />
          ))}
        </section>
      ) : (
        <EmptyState className="mt-4" description="등록된 이벤트가 없습니다." title="새로운 이벤트를 등록해보세요" />
      )}
      <section className="mt-6">
        <CustomPagination
          maxColumnNumber={10}
          targetPage={eventParam.page}
          totalDataLength={data.totalDataLength}
          onChangePage={page => setEventParam({ page })}
        />
      </section>
    </>
  );
};
