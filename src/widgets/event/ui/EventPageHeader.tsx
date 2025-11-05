import { useRouter } from 'next/navigation';
import { useQueryStates } from 'nuqs';
import { useTransition } from 'react';

import { cn } from '@/lib/utils';
import { eventParams } from '@/src/shared/lib/nuqs/searchParams';
import { Button } from '@/src/shared/ui/button';
import { LoadingSpinnerOverlay } from '@/src/shared/ui/LoadingSpinnerOverlay';
import { Tabs, TabsList, TabsTrigger } from '@/src/shared/ui/tabs';

type TEventPageHeaderProps = {
  isAdmin: boolean;
  viewMode: 'CARD' | 'TABLE';
  setViewMode: React.Dispatch<React.SetStateAction<'CARD' | 'TABLE'>>;
};

export const EventPageHeader = ({ isAdmin, viewMode, setViewMode }: TEventPageHeaderProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [eventParam, setEventParam] = useQueryStates(eventParams, {
    clearOnDefault: false,
    shallow: false,
  });

  return (
    <div className="w-full">
      {isPending && <LoadingSpinnerOverlay text="이벤트 작성 페이지 이동중.." />}
      <div className={cn('flex w-full flex-col justify-between gap-2', 'sm:flex-row sm:items-end')}>
        <div className={cn('flex flex-col justify-between gap-4', 'sm:flex-row sm:justify-end')}>
          <div className={cn('grid grid-cols-2 items-center gap-2')}>
            <button
              aria-label="table-view-button"
              className={cn(
                'group flex flex-row items-center justify-center gap-1 rounded-md border border-slate-200 fill-slate-200 px-4 py-1 transition-all duration-300 ease-in-out',
                viewMode === 'TABLE' ? 'bg-[#728146] fill-white' : 'hover:fill-slate-500',
              )}
              title="table-view-button"
              onClick={() => setViewMode('TABLE')}
            >
              <svg
                fill="current"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M320-80q-33 0-56.5-23.5T240-160v-480q0-33 23.5-56.5T320-720h480q33 0 56.5 23.5T880-640v480q0 33-23.5 56.5T800-80H320Zm0-80h200v-120H320v120Zm280 0h200v-120H600v120ZM80-240v-560q0-33 23.5-56.5T160-880h560v80H160v560H80Zm240-120h200v-120H320v120Zm280 0h200v-120H600v120ZM320-560h480v-80H320v80Z" />
              </svg>
              <span
                className={cn(
                  'mt-1 text-slate-200 transition-all duration-300 ease-in-out',
                  viewMode === 'TABLE' ? 'text-white' : 'group-hover:text-slate-500',
                )}
              >
                표 형식
              </span>
            </button>
            <button
              aria-label="card-view-button"
              className={cn(
                'group flex flex-row items-center justify-center gap-1 rounded-md border border-slate-200 fill-slate-200 px-4 py-1 transition-all duration-300 ease-in-out',
                viewMode === 'CARD' ? 'bg-[#728146] fill-white' : 'hover:fill-slate-500',
              )}
              title="card-view-button"
              onClick={() => setViewMode('CARD')}
            >
              <svg
                fill="current"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M80-360v-240q0-33 23.5-56.5T160-680q33 0 56.5 23.5T240-600v240q0 33-23.5 56.5T160-280q-33 0-56.5-23.5T80-360Zm280 160q-33 0-56.5-23.5T280-280v-400q0-33 23.5-56.5T360-760h240q33 0 56.5 23.5T680-680v400q0 33-23.5 56.5T600-200H360Zm360-160v-240q0-33 23.5-56.5T800-680q33 0 56.5 23.5T880-600v240q0 33-23.5 56.5T800-280q-33 0-56.5-23.5T720-360Zm-360 80h240v-400H360v400Zm120-200Z" />
              </svg>
              <span
                className={cn(
                  'mt-1 text-slate-200 transition-all duration-300 ease-in-out',
                  viewMode === 'CARD' ? 'text-white' : 'group-hover:text-slate-500',
                )}
              >
                카드 형식
              </span>
            </button>
          </div>
        </div>
        {isAdmin && (
          <Button
            disabled={!isAdmin}
            onClick={() => {
              if (!isAdmin) return;
              startTransition(() => {
                router.push('/event/form');
              });
            }}
          >
            {isAdmin ? '이벤트 만들기' : '관리자만 작성 가능'}
          </Button>
        )}
      </div>
      <Tabs
        className="mt-4"
        defaultValue={eventParam.status}
        onValueChange={status => setEventParam({ status, page: 1 })}
      >
        <TabsList>
          <TabsTrigger value="ALL">전체</TabsTrigger>
          <TabsTrigger value="UPCOMING">예정</TabsTrigger>
          <TabsTrigger value="ONGOING">진행중</TabsTrigger>
          <TabsTrigger value="ENDED">종료</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
