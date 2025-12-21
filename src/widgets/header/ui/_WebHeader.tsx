import type { InfiniteData } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/shared/ui/navigation-menu';
import type { INotificationResponseData } from '@/src/shared/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/src/shared/ui/popover';
import { AlarmMenu } from '@/src/widgets/AlarmMenu';
import { URLS } from '@/src/widgets/header';

import { UlButton } from './_UlButton';

interface IWebHeaderProps {
  isSignedIn: boolean;
  isPending: boolean;
  userId: string | undefined;
  notificationNoReadCount: number | undefined;
  handleClickNextNotifications: () => void;
  hasNextPage: boolean;
  isFetching: boolean;
  notificationData: InfiniteData<INotificationResponseData, unknown> | undefined;
}

export const WebHeader = ({
  isSignedIn,
  isPending,
  userId,
  notificationNoReadCount,
  handleClickNextNotifications: onClickNextNotifications,
  hasNextPage,
  isFetching,
  notificationData,
}: IWebHeaderProps) => {
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  return (
    <Popover open={notificationMenuOpen} onOpenChange={open => setNotificationMenuOpen(open)}>
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
                {isPending ? '로딩중..' : isSignedIn ? '마이페이지' : '로그인'}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {userId != null && (
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
                  modalClose={() => setNotificationMenuOpen(false)}
                  notificationData={notificationData}
                  userId={userId}
                />
              </PopoverContent>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </Popover>
  );
};
