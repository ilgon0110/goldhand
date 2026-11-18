'use client';

import { QueryErrorResetBoundary } from '@tanstack/react-query';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { cn } from '@/lib/utils';
import { useInfiniteAlarmQuery } from '@/src/entities/notification';
import { useUserSuspenseQuery } from '@/src/entities/user';

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

// userId가 없으면 비로그인 모양. user가 스트리밍되는 동안과 user 조회가 실패했을 때도 이 모양을 보여준다.
const HeaderView = ({ userId }: { userId?: string }) => {
  const { data: notificationData, isFetching, hasNextPage, fetchNextPage } = useInfiniteAlarmQuery(userId ?? '');

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

const UserHeader = () => {
  const { data } = useUserSuspenseQuery();
  return <HeaderView userId={data.userData?.userId} />;
};

// 루트 layout이 user를 await 없이 prefetch한다. Header는 layout 안이라 app/error.tsx가 잡지 못하므로
// 실패해도 사이트 전체(global-error)가 아니라 비로그인 모양으로 남도록 경계를 직접 둔다.
// layout은 다시 렌더되지 않으므로, 실패한 user 쿼리가 error로 굳지 않게 경로가 바뀔 때마다 reset해 다시 조회한다.
export const Header = () => {
  const pathname = usePathname();
  return (
    <QueryErrorResetBoundary>
      {({ reset: handleReset }) => (
        <ErrorBoundary fallback={<HeaderView />} resetKeys={[pathname]} onReset={handleReset}>
          <Suspense fallback={<HeaderView />}>
            <UserHeader />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};
