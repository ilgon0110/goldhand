'use client';

import { cn } from '@/lib/utils';
import { useGetEventListData } from '@/src/entities/event';
import { WithOptionalUser } from '@/src/entities/user';
import { useListQueryStates } from '@/src/feature/list-pagination';
import { eventParams } from '@/src/shared/lib/nuqs/searchParams';
import CustomPagination from '@/src/shared/ui/CustomPagination/CustomPagination';
import { EmptyState } from '@/src/shared/ui/empty-state';
import { EventCard, EventPageHeader } from '@/src/widgets/event';

export const EventPage = () => (
  <WithOptionalUser>{user => <EventPageContent isAdmin={user?.grade === 'admin'} />}</WithOptionalUser>
);

const EventPageContent = ({ isAdmin }: { isAdmin: boolean }) => {
  const [eventParam, setEventParam, isPending] = useListQueryStates(eventParams);

  const { data } = useGetEventListData({ page: eventParam.page, status: eventParam.status });

  return (
    <>
      <EventPageHeader
        handleStatusChange={status => setEventParam({ status, page: 1 })}
        isAdmin={isAdmin}
        status={eventParam.status}
        totalDataLength={data.totalDataLength}
      />
      <div aria-busy={isPending} className={cn('transition-opacity', isPending && 'opacity-50')}>
        {data.eventData.length > 0 ? (
          <section className="mt-2">
            {data.eventData.map(event => (
              <EventCard event={event} key={event.id} />
            ))}
          </section>
        ) : (
          <EmptyState className="mt-4" description="등록된 소식이 없습니다." title="새로운 소식을 등록해보세요" />
        )}
      </div>
      <section className="mt-6">
        <CustomPagination
          maxColumnNumber={10}
          targetPage={eventParam.page}
          totalDataLength={data.pageableDataLength}
          onChangePage={page => setEventParam({ page })}
        />
      </section>
    </>
  );
};
