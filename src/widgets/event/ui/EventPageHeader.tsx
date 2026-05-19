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
};

export const EventPageHeader = ({ isAdmin }: TEventPageHeaderProps) => {
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
