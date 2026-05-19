'use client';

import { useRouter } from 'next/navigation';
import { useQueryStates } from 'nuqs';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';
import { eventParams } from '@/src/shared/lib/nuqs/searchParams';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { Tabs, TabsList, TabsTrigger } from '@/src/shared/ui/tabs';

type TEventPageHeaderProps = {
  isAdmin: boolean;
  totalDataLength: number;
};

const PlusIcon = () => (
  <svg className="h-[13px] w-[13px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

export const EventPageHeader = ({ isAdmin, totalDataLength }: TEventPageHeaderProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [eventParam, setEventParam] = useQueryStates(eventParams, {
    clearOnDefault: false,
    shallow: false,
  });

  return (
    <>
      {isPending && <LoadingSpinnerOverlay text="이벤트 작성 페이지 이동중.." />}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 px-1 py-3.5">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-[12px] tracking-[0.08em] text-stone-500">
            총{' '}
            <span className="font-serif text-[14px] font-medium tracking-[0.02em] text-stone-900">
              {totalDataLength}
            </span>{' '}
            건
          </p>
          <span className="hidden h-3.5 w-px bg-stone-200 sm:block" />
          <Tabs defaultValue={eventParam.status} onValueChange={status => setEventParam({ status, page: 1 })}>
            <TabsList>
              <TabsTrigger value="ALL">전체</TabsTrigger>
              <TabsTrigger value="UPCOMING">예정</TabsTrigger>
              <TabsTrigger value="ONGOING">진행중</TabsTrigger>
              <TabsTrigger value="ENDED">종료</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {isAdmin && (
          <button
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-stone-900 bg-stone-900',
              'px-[18px] py-[9px] text-[13px] tracking-[0.02em] text-stone-100',
              'transition-all duration-200 hover:border-gold hover:bg-gold',
            )}
            onClick={() => {
              startTransition(() => {
                router.push('/event/form');
              });
            }}
          >
            <PlusIcon />
            이벤트 만들기
          </button>
        )}
      </div>
    </>
  );
};
