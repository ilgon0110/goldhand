import type { InfiniteData } from '@tanstack/react-query';
import { Bell, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/drawer';
import type { INotificationResponseData } from '@/src/shared/types';
import { AlarmMenu } from '@/src/widgets/AlarmMenu';
import { URLS } from '@/src/widgets/header';

interface IMobileHeader {
  userId: string | undefined;
  handleClickNextNotifications: () => void;
  hasNextPage: boolean;
  isFetching: boolean;
  notificationData: InfiniteData<INotificationResponseData, unknown> | undefined;
}

const subLinkClass = cn(
  'rounded-lg border-l-2 border-transparent py-2.5 pl-3 text-sm text-stone-600 transition',
  'hover:border-[#7DA63B] hover:bg-[#005522]/[0.04] hover:text-[#005522]',
);

const accordionTriggerClass = cn(
  'py-3.5 text-[15px] font-semibold text-[#0F2E16] hover:no-underline [&>svg]:text-stone-400',
);

const CloseIcon = () => (
  <svg
    aria-hidden="true"
    className="h-[18px] w-[18px]"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MobileHeader = ({
  userId,
  handleClickNextNotifications: onClickNextNotifications,
  hasNextPage,
  isFetching,
  notificationData,
}: IMobileHeader) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const notificationNoReadCount = notificationData?.pages[0]?.noReadCount ?? 0;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChangeMobileMenuOpen = () => {
    setMobileMenuOpen(prev => !prev);
  };

  return (
    <div className={cn('flex h-11 items-center justify-between border-b border-stone-100 px-2', 'lg:hidden')}>
      {/* LEFT: 메뉴 드로어 */}
      <Drawer direction="left" open={mobileMenuOpen} onOpenChange={handleChangeMobileMenuOpen}>
        <DrawerTrigger className="flex h-11 w-11 items-center justify-center rounded-xl text-[#005522] transition active:scale-95 active:bg-[#005522]/5">
          <span className="sr-only">메뉴 열기</span>
          <svg
            aria-hidden="true"
            className="h-[22px] w-[22px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </DrawerTrigger>
        <DrawerPortal>
          <DrawerOverlay className="fixed inset-0 bg-black/40" />
          <DrawerContent className="fixed inset-y-0 left-0 flex h-full w-[312px] flex-col rounded-r-2xl bg-white">
            <DrawerTitle className="sr-only">메뉴</DrawerTitle>
            <DrawerDescription className="sr-only">모바일 메뉴</DrawerDescription>

            {/* 헤더: 로고 + 닫기 */}
            <div className="flex items-center justify-between border-b border-stone-100 px-5 pb-4 pt-6">
              <Link href={URLS.HOME} onClick={handleChangeMobileMenuOpen}>
                <Image alt="고운황금손 로고" className="h-8 w-auto" height={32} src="/logo_green.png" width={128} />
              </Link>
              <DrawerClose asChild>
                <button className="flex h-9 w-9 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-600">
                  <span className="sr-only">닫기</span>
                  <CloseIcon />
                </button>
              </DrawerClose>
            </div>

            {/* 바디 */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {/* 마이페이지 / 로그인 CTA */}
              <Link
                className="mb-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#005522] py-3 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98]"
                href={userId != null ? URLS.MYPAGE : URLS.LOGIN}
                onClick={handleChangeMobileMenuOpen}
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {userId != null ? '마이페이지' : '로그인'}
              </Link>

              {/* 네비게이션 */}
              <nav className="flex flex-col">
                <Accordion collapsible type="single">
                  <AccordionItem className="border-stone-100" value="goldhand">
                    <AccordionTrigger className={accordionTriggerClass}>
                      <span className="flex items-baseline gap-2">
                        고운황금손
                        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400">
                          GoldHand
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-1 pb-3 pl-3 pt-0 text-base">
                      <Link className={subLinkClass} href={URLS.COMPANY} onClick={handleChangeMobileMenuOpen}>
                        인사말
                      </Link>
                      <Link className={subLinkClass} href={URLS.FRANCHISEE} onClick={handleChangeMobileMenuOpen}>
                        지점소개
                      </Link>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem className="border-stone-100" value="service">
                    <AccordionTrigger className={accordionTriggerClass}>
                      <span className="flex items-baseline gap-2">
                        산후관리사
                        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400">
                          Service
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-1 pb-3 pl-3 pt-0 text-base">
                      <Link className={subLinkClass} href={URLS.MANAGER.ABOUT} onClick={handleChangeMobileMenuOpen}>
                        산후관리사란?
                      </Link>
                      <Link className={subLinkClass} href={URLS.MANAGER.WORK} onClick={handleChangeMobileMenuOpen}>
                        산후관리사가 하는 일
                      </Link>
                      <Link className={subLinkClass} href={URLS.MANAGER.APPLY} onClick={handleChangeMobileMenuOpen}>
                        산후관리사 지원하기
                      </Link>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem className="border-stone-100" value="price">
                    <AccordionTrigger className={accordionTriggerClass}>
                      <span className="flex items-baseline gap-2">
                        이용안내
                        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400">Info</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-1 pb-3 pl-3 pt-0 text-base">
                      <Link className={subLinkClass} href={URLS.RENTAL} onClick={handleChangeMobileMenuOpen}>
                        대여물품
                      </Link>
                      <Link className={subLinkClass} href={URLS.PRICE} onClick={handleChangeMobileMenuOpen}>
                        이용요금
                      </Link>
                      <Link className={subLinkClass} href={URLS.VOUCHER} onClick={handleChangeMobileMenuOpen}>
                        정부지원바우처
                      </Link>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem className="border-stone-100" value="consult">
                    <AccordionTrigger className={accordionTriggerClass}>
                      <span className="flex items-baseline gap-2">
                        예약상담
                        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-400">
                          Consult
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-1 pb-3 pl-3 pt-0 text-base">
                      <Link className={subLinkClass} href={URLS.RESERVATION.APPLY} onClick={handleChangeMobileMenuOpen}>
                        상담신청
                      </Link>
                      <Link className={subLinkClass} href={URLS.RESERVATION.LIST} onClick={handleChangeMobileMenuOpen}>
                        신청목록
                      </Link>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Link
                  className="flex items-center justify-between border-b border-stone-100 py-3.5 text-[15px] font-semibold text-[#0F2E16] transition hover:text-[#005522]"
                  href={URLS.REVIEW}
                  onClick={handleChangeMobileMenuOpen}
                >
                  이용후기
                  <ChevronRight className="h-4 w-4 text-stone-300" />
                </Link>
                <Link
                  className="flex items-center justify-between py-3.5 text-[15px] font-semibold text-[#0F2E16] transition hover:text-[#005522]"
                  href={URLS.EVENT}
                  onClick={handleChangeMobileMenuOpen}
                >
                  이벤트
                  <ChevronRight className="h-4 w-4 text-stone-300" />
                </Link>
              </nav>
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>

      {/* CENTER: 로고 */}
      <Link href={URLS.HOME}>
        <Image alt="고운황금손 로고" className="h-8 w-auto" height={32} src="/logo_green.png" width={128} />
      </Link>

      {/* RIGHT: 알림 드로어 */}
      {userId != null ? (
        <Drawer direction="bottom" open={notificationMenuOpen} onOpenChange={open => setNotificationMenuOpen(open)}>
          <DrawerTrigger
            aria-label={notificationNoReadCount > 0 ? `알림 ${notificationNoReadCount}개` : '알림'}
            className="relative flex h-11 w-11 items-center justify-center rounded-xl text-[#0F2E16] transition active:scale-95 active:bg-[#005522]/5"
          >
            <Bell aria-hidden="true" size={21} />
            {notificationNoReadCount > 0 && (
              <div
                aria-hidden="true"
                className="absolute right-2 top-2 inline-flex h-4 w-4 animate-pulse items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white duration-500"
              >
                {notificationNoReadCount}
              </div>
            )}
          </DrawerTrigger>
          <DrawerPortal>
            <DrawerOverlay className="fixed inset-0 bg-black/40" />
            <DrawerContent className="fixed inset-x-0 bottom-0 flex h-[78%] w-full flex-col rounded-t-3xl bg-white">
              <DrawerTitle className="sr-only">알림조회</DrawerTitle>
              <DrawerDescription className="sr-only">알림 목록</DrawerDescription>

              {/* 드래그 핸들 */}
              <div className="flex justify-center pb-2 pt-3">
                <div className="h-1.5 w-10 rounded-full bg-stone-200" />
              </div>

              {/* 헤더: 제목 + 뱃지 + 닫기 */}
              <div className="flex items-center justify-between border-b border-stone-100 px-5 pb-4 pt-3">
                <h2 className="flex items-center gap-2 text-base font-bold text-[#0F2E16]">
                  알림조회
                  {notificationNoReadCount > 0 && (
                    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#005522] px-1.5 text-[11px] font-bold text-white">
                      {notificationNoReadCount}
                    </span>
                  )}
                </h2>
                <DrawerClose asChild>
                  <button className="flex h-9 w-9 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-600">
                    <span className="sr-only">닫기</span>
                    <CloseIcon />
                  </button>
                </DrawerClose>
              </div>

              {/* 알림 목록 */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <AlarmMenu
                  handleClickNextNotifications={onClickNextNotifications}
                  hasNextPage={hasNextPage}
                  isFetching={isFetching}
                  modalClose={() => setNotificationMenuOpen(false)}
                  notificationData={notificationData}
                  userId={userId}
                />
              </div>
            </DrawerContent>
          </DrawerPortal>
        </Drawer>
      ) : (
        <div aria-hidden="true" className="h-11 w-11" />
      )}
    </div>
  );
};
