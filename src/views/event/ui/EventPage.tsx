'use client';

import { useRouter } from 'next/navigation';
import { useQueryStates } from 'nuqs';
import { useEffect, useState, useTransition } from 'react';

import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/src/shared/hooks/useMediaQuery';
import { eventParams } from '@/src/shared/lib/nuqs/searchParams';
import type { IEventDetailData, IUserDetailData } from '@/src/shared/types';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { sendViewLog } from '@/src/shared/utils/verifyViewId';
import { EventCard, EventPageHeader } from '@/src/widgets/event';
import { generateReviewDescription, generateReviewThumbnailSrc } from '@/src/widgets/goldHandReview';
import { WidgetPagination } from '@/src/widgets/Pagination';

interface IEventPageProps {
  eventData: IEventDetailData[];
  userData: IUserDetailData | null;
  totalDataLength: number;
}

export const EventPage = ({ eventData, userData, totalDataLength }: IEventPageProps) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'CARD' | 'TABLE'>('CARD');
  const [eventParam, setEventParam] = useQueryStates(eventParams, {
    clearOnDefault: false,
    shallow: false,
  });
  const [isPending, startTransition] = useTransition();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    if (!isDesktop) {
      // 모바일 화면에서는 무조건 TABLE 모드로 설정
      setViewMode('TABLE');
    } else {
      // 데스크탑 화면에서는 기본적으로 CARD 모드로 설정
      setViewMode('CARD');
    }
  }, [isDesktop]);

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="해당 이벤트로 이동중.." />}
      <SectionTitle title="고운황금손 이벤트" />
      <div
        className={cn(
          'flex w-full flex-col items-baseline justify-between gap-4',
          'sm:flex-row sm:items-center sm:gap-0',
        )}
      >
        <EventPageHeader isAdmin={userData?.grade === 'admin'} setViewMode={setViewMode} viewMode={viewMode} />
      </div>
      <section
        className={cn(
          'mt-6 grid gap-2',
          viewMode === 'TABLE' ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        )}
      >
        {viewMode === 'TABLE' && <div className="font-bold">NO</div>}
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
            thumbnail={generateReviewThumbnailSrc(event.htmlString)}
            title={event.title}
            viewMode={viewMode}
          />
        ))}
      </section>
      <section className="mt-6">
        <WidgetPagination
          maxColumnNumber={10}
          targetPage={eventParam.page}
          totalDataLength={totalDataLength}
          onChangePage={page => setEventParam({ page })}
        />
      </section>
    </>
  );
};
