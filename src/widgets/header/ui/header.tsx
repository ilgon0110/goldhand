'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { useAlarm } from '@/src/shared/hooks/useAlarm';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { useInfiniteAlarmQuery } from '@/src/shared/hooks/useInfiniteAlarmQuery';

import { MobileHeader } from './_MobileHeader';
import { WebHeader } from './_WebHeader';

const _DevBanner = () => {
  return (
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
      <Link
        className="font-normal text-[#0000b5]"
        href="https://goldbaby.itpage.kr/"
        rel="noopener noreferrer"
        target="_blank"
      >
        공식 사이트 이동하기
        <span className="sr-only">(새 탭에서 열림)</span>
      </Link>
    </div>
  );
};

export const Header = () => {
  const { data: userData } = useAuth();
  const userId = userData?.userData?.userId;
  const { data: notificationData, isFetching, hasNextPage, fetchNextPage } = useInfiniteAlarmQuery(userId ?? '');
  useAlarm(userId ?? '');

  const onClickNextNotifications = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  return (
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
  );
};
