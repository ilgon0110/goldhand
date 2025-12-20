'use client';

import { Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { forwardRef, useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/shared/ui/navigation-menu';
import { useAlarm } from '@/src/shared/hooks/useAlarm';
import { useAuth } from '@/src/shared/hooks/useAuth';
import { useInfiniteAlarmQuery } from '@/src/shared/hooks/useInfiniteAlarmQuery';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/shared/ui/popover';
import { AlarmMenu } from '@/src/widgets/AlarmMenu';

import { URLS } from '../index';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn, pending, userData } = useAuth();
  const {
    data: notificationData,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteAlarmQuery(userData?.userId ?? '');
  useAlarm(userData?.userId ?? '');

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
      <Popover>
        <div className="sticky top-0 z-50 animate-pulse bg-slate-300 py-3 text-center font-bold text-[#2B0000] duration-500">
          공식 사이트가 아닌 개발 중인 사이트 입니다.{' '}
          <Link className="font-normal text-[#0000b5]" href="https://goldbaby.itpage.kr/">
            공식 사이트 이동하기
          </Link>
        </div>
        <header className="relative mx-auto max-w-7xl py-2">
          {userData?.userId != null && (
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
          <NavigationMenu>
            <NavigationMenuList className={cn('hidden gap-3', 'lg:flex lg:flex-wrap')}>
              <NavigationMenuItem className="relative">
                <div className="flex items-center justify-center lg:flex-1">
                  <Link className="-m-1.5 p-1.5" href={URLS.HOME}>
                    <span className="sr-only">고운황금손</span>
                    <Image alt="home_logo" height={36} sizes="75" src="/logo_green.png" width={128} />
                  </Link>
                </div>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <UlButton enText="GoldHand" text="고운황금손" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex w-[170px] flex-col items-center gap-2 py-4">
                    <NavigationMenuLink asChild className="w-full text-sm leading-6 text-gray-900">
                      <Link href={URLS.COMPANY}>인사말</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild className="w-full text-sm leading-6 text-gray-900">
                      <Link href={URLS.FRANCHISEE}>지점소개</Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <UlButton enText="Service" text="산후관리사" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex w-[170px] flex-col items-center gap-2 py-4">
                    <NavigationMenuLink asChild className="w-full text-sm leading-6 text-gray-900">
                      <Link href={URLS.MANAGER.ABOUT}>산후관리사란?</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild className="w-full text-sm leading-6 text-gray-900">
                      <Link href={URLS.MANAGER.WORK}>산후관리사가 하는 일</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild className="w-full text-sm leading-6 text-gray-900">
                      <Link href={URLS.MANAGER.APPLY}>산후관리사 지원하기</Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <UlButton enText="Price" text="이용안내" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex w-[170px] flex-col items-center gap-2 py-4">
                    <NavigationMenuLink asChild className="w-full text-sm leading-6 text-gray-900">
                      <Link href={URLS.RENTAL}>대여물품</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild className="w-full text-sm leading-6 text-gray-900">
                      <Link href={URLS.PRICE}>이용요금</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild className="w-full text-sm leading-6 text-gray-900">
                      <Link href={URLS.VOUCHER}>정부지원바우처</Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <UlButton enText="Consult" text="예약상담" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="flex w-[170px] flex-col items-center gap-2 py-4">
                    <NavigationMenuLink asChild className="w-full text-sm leading-6 text-gray-900">
                      <Link href={URLS.RESERVATION.APPLY}>상담신청</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild className="w-full text-sm leading-6 text-gray-900">
                      <Link href={URLS.RESERVATION.LIST}>신청목록</Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className="w-full text-sm leading-6 text-gray-900">
                  <Link href={URLS.REVIEW}>
                    <UlButton enText="Review" text="이용후기" />
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className="w-full text-sm leading-6 text-gray-900">
                  <Link href={URLS.EVENT}>
                    <UlButton enText="Event" text="이벤트" />
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className="w-40 rounded-full border border-[#0F2E16]">
                  <Link href={isSignedIn ? URLS.MYPAGE : URLS.LOGIN}>
                    {pending ? '로딩중..' : isSignedIn ? '마이페이지' : '로그인'}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {userData?.userId != null && (
                <NavigationMenuItem>
                  <PopoverTrigger asChild>
                    <button className="relative flex items-center justify-center">
                      <Bell size={20} />
                      {notificationNoReadCount != null && notificationNoReadCount > 0 && (
                        <div className="absolute -right-2 -top-2 inline-flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-red-600 p-1 text-xs font-semibold text-white duration-500">
                          {notificationNoReadCount}
                        </div>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="max-h-[500px] overflow-y-auto p-4">
                    <AlarmMenu
                      handleClickNextNotifications={onClickNextNotifications}
                      hasNextPage={hasNextPage}
                      isFetching={isFetching}
                      notificationData={notificationData}
                      userId={userData.userId || ''}
                    />
                  </PopoverContent>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>

            {/* 햄버거 icon, 모바일 헤더 부분 */}
            <div className="relative lg:hidden">
              <Drawer direction="left" open={mobileMenuOpen} onOpenChange={open => setMobileMenuOpen(open)}>
                <DrawerTrigger className="px-6 align-middle">
                  <span className="sr-only">메뉴 열기</span>
                  <svg
                    aria-hidden="true"
                    className="h-6 w-6"
                    fill="none"
                    stroke="black"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
                          <MoblieHeaderContent onChangeMobileMenuOpen={handleChangeMobileMenuOpen} />
                        </div>
                      </div>
                    </DrawerHeader>
                  </DrawerContent>
                </DrawerPortal>
              </Drawer>
            </div>
          </NavigationMenu>
        </header>
      </Popover>
      {/* </nav> */}
    </>
  );
};

const MoblieHeaderContent = ({ onChangeMobileMenuOpen }: { onChangeMobileMenuOpen: () => void }) => {
  const { isSignedIn, pending } = useAuth();
  const handleChangeMobileMenuOpen = () => {
    onChangeMobileMenuOpen();
  };
  return (
    <div className="flex flex-col gap-4 lg:hidden">
      <Link
        className="font-semibold leading-6 text-gray-900"
        href={isSignedIn ? URLS.MYPAGE : URLS.LOGIN}
        onClick={handleChangeMobileMenuOpen}
      >
        <UlButton enText="" text={pending ? '로딩중..' : isSignedIn ? '마이페이지' : '로그인'} />
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
  );
};

const UlButton = forwardRef(
  (
    {
      text,
      enText,
      children,
    }: {
      text: string;
      enText?: string;
      children?: React.ReactNode;
    },
    ref,
  ) => {
    return children ? (
      <Accordion className="text-black lg:hidden" collapsible type="single">
        <AccordionItem value="item-1">
          <AccordionTrigger className="relative flex items-center justify-center py-2 text-base font-semibold">
            {text}
          </AccordionTrigger>
          <AccordionContent>{children}</AccordionContent>
        </AccordionItem>
      </Accordion>
    ) : (
      <div className={cn('flex flex-row items-center justify-center -space-y-2 px-4 py-2 lg:flex-col')}>
        <div className="text-base">{text}</div>
        {!!enText && <div className="hidden text-[10px] text-[#00552a] lg:block">{enText}</div>}
      </div>
    );
  },
);

UlButton.displayName = 'UlButton';
