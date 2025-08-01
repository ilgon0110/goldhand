'use client';

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
  NavigationMenuTrigger,
} from '@/shared/ui/navigation-menu';
import { useAuthState } from '@/src/shared/hooks/useAuthState';

import { URLS } from '../index';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn, pending, isLinked } = useAuthState();

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
    <>
      <div className="text-red sticky top-0 z-50 animate-pulse bg-slate-300 py-3 text-center font-bold text-red-500 duration-500">
        공식 사이트가 아닌 개발 중인 사이트 입니다.{' '}
        <Link className="font-normal text-blue-500" href="https://goldbaby.itpage.kr/">
          공식 사이트 이동하기
        </Link>
      </div>
      <header className="bg-white">
        <NavigationMenu className="z-50 mx-auto flex h-14 max-w-7xl list-none items-center justify-between px-8">
          <div className="flex lg:flex-1">
            <Link className="-m-1.5 p-1.5" href={URLS.HOME}>
              <span className="sr-only">고운황금손</span>
              <div className="relative h-8 w-32">
                <Image alt="home_logo" fill sizes="75" src="/logo_green.png" />
              </div>
            </Link>
          </div>
          <div className="box-border hidden items-center gap-2 pt-1 lg:flex">
            <NavigationMenuItem>
              <NavigationMenuLink href={URLS.COMPANY}>
                <UlButton enText="Gold Baby" text="고운황금손" />
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenu>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <UlButton enText="Service" text="산후관리사" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink className="text-sm leading-6 text-gray-900" href={URLS.MANAGER.ABOUT}>
                    산후관리사란?
                  </NavigationMenuLink>
                  <NavigationMenuLink className="text-sm leading-6 text-gray-900" href={URLS.MANAGER.WORK}>
                    산후관리사가 하는 일
                  </NavigationMenuLink>
                  <NavigationMenuLink className="text-sm leading-6 text-gray-900" href={URLS.MANAGER.APPLY}>
                    산후관리사 지원하기
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenu>
            <NavigationMenu>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <UlButton enText="Price" text="이용안내" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink className="text-sm leading-6 text-gray-900" href={URLS.RENTAL}>
                    대여물품
                  </NavigationMenuLink>
                  <NavigationMenuLink className="text-sm leading-6 text-gray-900" href={URLS.PRICE}>
                    이용요금
                  </NavigationMenuLink>
                  <NavigationMenuLink className="text-sm leading-6 text-gray-900" href={URLS.VOUCHER}>
                    정부지원바우처
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenu>
            <NavigationMenuItem>
              <NavigationMenuLink href={URLS.FRANCHISEE}>
                <UlButton enText="Franchisee" text="지점안내" />
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenu>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <UlButton enText="Consult" text="예약상담" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuLink className="text-sm leading-6 text-gray-900" href={URLS.RESERVATION.APPLY}>
                    상담신청
                  </NavigationMenuLink>
                  <NavigationMenuLink className="text-sm leading-6 text-gray-900" href={URLS.RESERVATION.LIST}>
                    신청목록
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenu>
            <NavigationMenuItem>
              <NavigationMenuLink href={URLS.REVIEW}>
                <UlButton enText="Review" text="이용후기" />
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                className="absolute right-8 top-2 rounded-full border border-[#0F2E16] px-12 py-2"
                href={isLinked ? URLS.MYPAGE : isSignedIn ? '/signup' : URLS.LOGIN}
              >
                {pending ? '로딩중..' : isLinked ? '마이페이지' : isSignedIn ? '회원가입' : '로그인'}
              </NavigationMenuLink>
            </NavigationMenuItem>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <a className="text-sm font-semibold leading-6 text-gray-900" href="#">
              {/* <span aria-hidden="true">&rarr;</span> */}
            </a>
          </div>
          {/* 햄버거 icon, 모바일 헤더 부분 */}
          <div className="lg:hidden">
            <Drawer direction="right" open={mobileMenuOpen} onOpenChange={open => setMobileMenuOpen(open)}>
              <DrawerTrigger>
                <span className="sr-only">메뉴 열기</span>
                <svg
                  aria-hidden="true"
                  className="h-6 w-6"
                  fill="none"
                  stroke="black"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </DrawerTrigger>
              <DrawerPortal>
                <DrawerOverlay className="fixed inset-0 bg-black/40" />
                <DrawerContent className="fixed bottom-0 right-0 flex h-full w-[360px] flex-col rounded-bl-sm rounded-tl-sm bg-white pt-6 lg:hidden">
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
        {/* </nav> */}
      </header>
    </>
  );
};

const MoblieHeaderContent = ({ onChangeMobileMenuOpen }: { onChangeMobileMenuOpen: () => void }) => {
  const { isSignedIn, pending } = useAuthState();
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
      <Link className="font-semibold leading-6 text-gray-900" href={URLS.COMPANY} onClick={handleChangeMobileMenuOpen}>
        <UlButton enText="Gold Baby" text="고운황금손" />
      </Link>
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
      <Link
        className="text-base font-semibold leading-6 text-gray-900"
        href={URLS.FRANCHISEE}
        onClick={handleChangeMobileMenuOpen}
      >
        <UlButton enText="Franchisee" text="지점안내" />
      </Link>
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
      <ul className={cn('flex flex-row items-center justify-center -space-y-2 px-4 py-2 lg:flex-col')}>
        <div className="text-base">{text}</div>
        {!!enText && <div className="hidden text-[10px] text-[#728146] lg:block">{enText}</div>}
      </ul>
    );
  },
);

UlButton.displayName = 'UlButton';
