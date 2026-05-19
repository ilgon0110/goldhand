'use client';

import { useRouter } from 'next/navigation';
import { useQueryStates } from 'nuqs';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';
import { generateReviewDescription } from '@/src/entities/review';
import { eventParams } from '@/src/shared/lib/nuqs/searchParams';
import type { IEventDetailData, IUserDetailData } from '@/src/shared/types';
import CustomPagination from '@/src/shared/ui/CustomPagination/CustomPagination';
import { EmptyState } from '@/src/shared/ui/empty-state';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';
import { sendViewLog } from '@/src/shared/utils/verifyViewId';
import { EventCard, EventPageHeader } from '@/src/widgets/event';

interface IEventPageProps {
  eventData: IEventDetailData[];
  userData: IUserDetailData | null;
  totalDataLength: number;
}

export const EventPage = ({ eventData, userData, totalDataLength }: IEventPageProps) => {
  const router = useRouter();
  const [eventParam, setEventParam] = useQueryStates(eventParams, {
    clearOnDefault: false,
    shallow: false,
  });
  const [isPending, startTransition] = useTransition();

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="해당 이벤트로 이동중.." />}
      <SectionTitleHero label="고운황금손 이벤트" />
      <div
        className={cn(
          'flex w-full flex-col items-baseline justify-between gap-4',
          'sm:flex-row sm:items-center sm:gap-0',
        )}
      >
        <EventPageHeader isAdmin={userData?.grade === 'admin'} />
      </div>
      {eventData.length > 0 ? (
        <section className="mt-6 grid grid-cols-1 gap-2">
          {eventData.map(event => (
            <EventCard
              createdAt={event.createdAt}
              description={generateReviewDescription(event.htmlString)}
              handleClick={() => {
                startTransition(async () => {
                  await sendViewLog(event.id);
                  router.push(`/event/${event.id}`);
                });
              }}
              id={event.id}
              key={event.id}
              rowNumber={event.rowNumber}
              thumbnail={event.thumbnail}
              title={event.title}
            />
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
