'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { useAlarm } from '@/src/shared/hooks/useAlarm';
import { useInfiniteAlarmQuery } from '@/src/shared/hooks/useInfiniteAlarmQuery';
import type { IUserDetailData } from '@/src/shared/types';

import { MobileHeader } from './_MobileHeader';
import { WebHeader } from './_WebHeader';

interface IHeaderProps {
  userData: IUserDetailData | null;
}

export const Header = ({ userData }: IHeaderProps) => {
  const userId = userData?.userId;
  const { data: notificationData, isFetching, hasNextPage, fetchNextPage } = useInfiniteAlarmQuery(userId ?? '');
  useAlarm(userId ?? '');

  const onClickNextNotifications = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  return (
    <>
      <div
        className={cn(
          'pulse',
          'sticky',
          'top-0',
          'z-50',
          'bg-slate-300',
          'py-3',
          'text-center',
          'text-xs',
          'font-bold',
          'text-[#2B0000]',
          'duration-500',
          'sm:text-base',
        )}
      >
        공식 사이트가 아닌 개발 중인 사이트 입니다.{' '}
        <Link className="font-normal text-[#0000b5]" href="https://goldbaby.itpage.kr/">
          공식 사이트 이동하기
        </Link>
      </div>
      <header className="relative mx-auto max-w-7xl py-2">
        <WebHeader
          handleClickNextNotifications={onClickNextNotifications}
          hasNextPage={hasNextPage}
          isFetching={isFetching}
          notificationData={notificationData}
          userId={userId}
        />
        <MobileHeader
          handleClickNextNotifications={onClickNextNotifications}
          hasNextPage={hasNextPage}
          isFetching={isFetching}
          notificationData={notificationData}
          userId={userId}
        />
      </header>
    </>
  );
};
