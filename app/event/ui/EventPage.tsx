'use client';

import { useQueryStates } from 'nuqs';

import { eventParams } from '@/src/shared/lib/nuqs/searchParams';
import type { IEventDetailData, IUserDetailData } from '@/src/shared/types';
import CustomPagination from '@/src/shared/ui/CustomPagination/CustomPagination';
import { EmptyState } from '@/src/shared/ui/empty-state';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';
import { EventCard, EventPageHeader } from '@/src/widgets/event';

interface IEventPageProps {
  eventData: IEventDetailData[];
  userData: IUserDetailData | null;
  totalDataLength: number;
}

export const EventPage = ({ eventData, userData, totalDataLength }: IEventPageProps) => {
  const [eventParam, setEventParam] = useQueryStates(eventParams, {
    clearOnDefault: false,
    shallow: false,
  });

  return (
    <>
      <SectionTitleHero label="고운황금손 이벤트" />
      <EventPageHeader isAdmin={userData?.grade === 'admin'} totalDataLength={totalDataLength} />
      {eventData.length > 0 ? (
        <section className="mt-2">
          {eventData.map(event => (
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
          totalDataLength={totalDataLength}
          onChangePage={page => setEventParam({ page })}
        />
      </section>
    </>
  );
};
