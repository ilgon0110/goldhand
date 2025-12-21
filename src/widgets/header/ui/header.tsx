'use client';

import Link from 'next/link';

import { useAlarm } from '@/src/shared/hooks/useAlarm';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { useInfiniteAlarmQuery } from '@/src/shared/hooks/useInfiniteAlarmQuery';

import { MobileHeader } from './_MobileHeader';
import { WebHeader } from './_WebHeader';

export const Header = () => {
  const { isSignedIn, pending: isPending, userData } = useAuth();
  const {
    data: notificationData,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteAlarmQuery(userData?.userId ?? '');
  useAlarm(userData?.userId ?? '');

  const notificationNoReadCount = notificationData?.pages.reduce((acc, page) => {
    return acc + page.data.filter(item => !item.isRead).length;
  }, 0);

  const onClickNextNotifications = () => {
    if (hasNextPage && !isFetching) {
      fetchNextPage();
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 animate-pulse bg-slate-300 py-3 text-center font-bold text-[#2B0000] duration-500">
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
          isPending={isPending}
          isSignedIn={isSignedIn}
          notificationData={notificationData}
          notificationNoReadCount={notificationNoReadCount}
          userId={userData?.userId}
        />

        <MobileHeader
          handleClickNextNotifications={onClickNextNotifications}
          hasNextPage={hasNextPage}
          isFetching={isFetching}
          isPending={isPending}
          isSignedIn={isSignedIn}
          notificationData={notificationData}
          notificationNoReadCount={notificationNoReadCount}
          userId={userData?.userId}
        />
      </header>
    </>
  );
};
