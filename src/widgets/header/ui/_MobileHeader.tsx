import type { InfiniteData } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/drawer';
import type { INotificationResponseData } from '@/src/shared/types';
import { URLS } from '@/src/widgets/header';

import { AlarmMenu } from '../../AlarmMenu';
import { UlButton } from './_UlButton';

interface IMobileHeader {
  userId: string | undefined;
  notificationNoReadCount: number | undefined;
  isSignedIn: boolean;
  isPending: boolean;
  handleClickNextNotifications: () => void;
  hasNextPage: boolean;
  isFetching: boolean;
  notificationData: InfiniteData<INotificationResponseData, unknown> | undefined;
}

export const MobileHeader = ({
  userId,
  notificationNoReadCount,
  isSignedIn,
  isPending,
  handleClickNextNotifications: onClickNextNotifications,
  hasNextPage,
  isFetching,
  notificationData,
}: IMobileHeader) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // 브라우저 크기 추적
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setMobileMenuOpen(false);
      }
    };

    // 컴포넌트 마운트 시에 이벤트 리스너 추가
    window.addEventListener('resize', handleResize);

    // 처음 크기 설정
    handleResize();

    // 클린업: 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChangeMobileMenuOpen = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="relative flex items-center lg:hidden">
      <Drawer direction="left" open={mobileMenuOpen} onOpenChange={handleChangeMobileMenuOpen}>
        <DrawerTrigger className="px-6 align-middle">
          <span className="sr-only">메뉴 열기</span>
          <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="black" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </DrawerTrigger>
        <DrawerPortal>
          <DrawerOverlay className="fixed inset-0 bg-black/40" />
          <DrawerContent className="fixed bottom-0 left-0 flex h-full w-[360px] flex-col rounded-br-sm rounded-tr-sm bg-white pt-6 lg:hidden">
            <DrawerHeader>
              <div className="h-full flex-1 p-4">
                <div className="mx-auto max-w-md">
                  <DrawerTitle className="mb-4 flex items-center justify-center font-medium">
                    <div className="relative h-8 w-32">
                      <Link href={URLS.HOME}>
                        <Image alt="home_logo" fill sizes="75" src="/logo_green.png" />
                      </Link>
                    </div>
                  </DrawerTitle>
                  <DrawerDescription className="sr-only">모바일 헤더</DrawerDescription>
                  <div className="flex flex-col gap-4 lg:hidden">
                    <Link
                      className="font-semibold leading-6 text-gray-900"
                      href={isSignedIn ? URLS.MYPAGE : URLS.LOGIN}
                      onClick={handleChangeMobileMenuOpen}
                    >
                      <UlButton enText="" text={isPending ? '로딩중..' : isSignedIn ? '마이페이지' : '로그인'} />
                    </Link>
                    <UlButton enText="GoldHand" text="고운황금손">
                      <div className="flex w-full flex-col items-center justify-center gap-6 py-6 text-base font-semibold leading-6 text-gray-900">
                        <Link href={URLS.COMPANY} onClick={handleChangeMobileMenuOpen}>
                          인사말
                        </Link>
                        <Link href={URLS.FRANCHISEE} onClick={handleChangeMobileMenuOpen}>
                          지점소개
                        </Link>
                      </div>
                    </UlButton>
                    <UlButton enText="Service" text="산후관리사">
                      <div className="flex w-full flex-col items-center justify-center gap-6 py-6 text-base font-semibold leading-6 text-gray-900">
                        <Link href={URLS.MANAGER.ABOUT} onClick={handleChangeMobileMenuOpen}>
                          산후관리사란?
                        </Link>
                        <Link href={URLS.MANAGER.WORK} onClick={handleChangeMobileMenuOpen}>
                          산후관리사가 하는 일
                        </Link>
                        <Link href={URLS.MANAGER.APPLY} onClick={handleChangeMobileMenuOpen}>
                          산후관리사 지원하기
                        </Link>
                      </div>
                    </UlButton>
                    <UlButton enText="Price" text="이용안내">
                      <div className="flex w-full flex-col items-center justify-center gap-6 py-6 text-base font-semibold leading-6 text-gray-900">
                        <Link href={URLS.RENTAL} onClick={handleChangeMobileMenuOpen}>
                          대여물품
                        </Link>
                        <Link href={URLS.PRICE} onClick={handleChangeMobileMenuOpen}>
                          이용요금
                        </Link>
                        <Link href={URLS.VOUCHER} onClick={handleChangeMobileMenuOpen}>
                          정부지원바우처
                        </Link>
                      </div>
                    </UlButton>
                    <UlButton enText="Consult" text="예약상담">
                      <div className="flex w-full flex-col items-center justify-center gap-6 py-6 text-base font-semibold leading-6 text-gray-900">
                        <Link href={URLS.RESERVATION.APPLY} onClick={handleChangeMobileMenuOpen}>
                          상담신청
                        </Link>
                        <Link href={URLS.RESERVATION.LIST} onClick={handleChangeMobileMenuOpen}>
                          신청목록
                        </Link>
                      </div>
                    </UlButton>
                    <Link
                      className="text-sm font-semibold leading-6 text-gray-900"
                      href={URLS.REVIEW}
                      onClick={handleChangeMobileMenuOpen}
                    >
                      <UlButton enText="Review" text="이용후기" />
                    </Link>
                    <Link
                      className="text-sm font-semibold leading-6 text-gray-900"
                      href={URLS.EVENT}
                      onClick={handleChangeMobileMenuOpen}
                    >
                      <UlButton enText="Event" text="이벤트" />
                    </Link>
                  </div>
                </div>
              </div>
            </DrawerHeader>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>

      <Drawer direction="bottom" open={notificationMenuOpen} onOpenChange={open => setNotificationMenuOpen(open)}>
        <DrawerTrigger className="px-6">
          {userId != null && (
            <button
              className={cn('absolute right-6 top-1/2 flex -translate-y-1/2 items-center justify-center', 'lg:hidden')}
            >
              <Bell size={20} />
              {notificationNoReadCount != null && notificationNoReadCount > 0 && (
                <div className="absolute -right-2 -top-2 inline-flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-red-600 p-1 text-xs font-semibold text-white duration-500">
                  {notificationNoReadCount}
                </div>
              )}
            </button>
          )}
        </DrawerTrigger>
        <DrawerPortal>
          <DrawerOverlay className="fixed inset-0 bg-black/40" />
          <DrawerContent className="fixed bottom-0 left-0 flex h-[80vh] w-full flex-col rounded-br-sm rounded-tr-sm bg-white px-6 pb-12 pt-6">
            <DrawerHeader>
              <DrawerTitle className="mb-4 flex items-center justify-center font-medium">알림조회</DrawerTitle>
              <DrawerDescription className="sr-only">모바일 헤더</DrawerDescription>
            </DrawerHeader>
            <div className="overflow-y-auto">
              <AlarmMenu
                handleClickNextNotifications={onClickNextNotifications}
                hasNextPage={hasNextPage}
                isFetching={isFetching}
                modalClose={() => setNotificationMenuOpen(false)}
                notificationData={notificationData}
                userId={userId || ''}
              />
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    </div>
  );
};
