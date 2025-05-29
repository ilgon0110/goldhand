"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/ui/drawer";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/shared/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";
import { cn } from "@/lib/utils";
import { forwardRef, useEffect, useState } from "react";
import { URLS, useAuthInit } from "../index";
import { useAuthStore } from "@/src/shared/store";

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { accessToken, hydrated } = useAuthStore();
  useAuthInit();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // 브라우저 크기 추적
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setMobileMenuOpen(false);
      }
    };

    // 컴포넌트 마운트 시에 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 처음 크기 설정
    handleResize();

    // 클린업: 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onChangeMobileMenuOpen = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white">
      <NavigationMenu className="mx-auto flex max-w-7xl items-center justify-between h-14 px-8 list-none z-50">
        <div className="flex lg:flex-1">
          <Link href={URLS.HOME} className="-m-1.5 p-1.5">
            <span className="sr-only">고운황금손</span>
            <div className="w-32 h-8 relative">
              <Image src="/logo_green.png" alt="home_logo" fill sizes="75" />
            </div>
          </Link>
        </div>
        <div className="hidden lg:flex pt-1 box-border items-center gap-2">
          <NavigationMenuItem>
            <NavigationMenuLink href={URLS.COMPANY}>
              <UlButton text="고운황금손" enText="Gold Baby" />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenu>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <UlButton text="산후관리사" enText="Service" />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink
                  href={URLS.MANAGER.ABOUT}
                  className="text-sm leading-6 text-gray-900"
                >
                  산후관리사란?
                </NavigationMenuLink>
                <NavigationMenuLink
                  href={URLS.MANAGER.WORK}
                  className="text-sm leading-6 text-gray-900"
                >
                  산후관리사가 하는 일
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenu>
          <NavigationMenu>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <UlButton text="이용안내" enText="Price" />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink
                  href="#"
                  className="text-sm leading-6 text-gray-900"
                >
                  대여물품
                </NavigationMenuLink>
                <NavigationMenuLink
                  href="#"
                  className="text-sm leading-6 text-gray-900"
                >
                  이용요금
                </NavigationMenuLink>
                <NavigationMenuLink
                  href="#"
                  className="text-sm leading-6 text-gray-900"
                >
                  정부지원바우처
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenu>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">
              <UlButton text="지점안내" enText="Franchisee" />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenu>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <UlButton text="예약상담" enText="Consult" />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink
                  href={URLS.RESERVATION.APPLY}
                  className="text-sm leading-6 text-gray-900"
                >
                  상담신청
                </NavigationMenuLink>
                <NavigationMenuLink
                  href={URLS.RESERVATION.LIST}
                  className="text-sm leading-6 text-gray-900"
                >
                  신청목록
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenu>
          <NavigationMenuItem>
            <NavigationMenuLink href={URLS.REVIEW}>
              <UlButton text="이용후기" enText="Review" />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="#">
              <UlButton text="오시는길" enText="Location" />
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href={URLS.LOGIN}
              className="px-12 py-2 rounded-full border border-[#0F2E16] absolute right-8 top-2"
            >
              {!hydrated
                ? "로딩중.."
                : accessToken !== null
                ? "마이페이지"
                : "로그인"}
            </NavigationMenuLink>
          </NavigationMenuItem>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            {/* <span aria-hidden="true">&rarr;</span> */}
          </a>
        </div>
        {/* 햄버거 icon, 모바일 헤더 부분 */}
        <div className="lg:hidden">
          <Drawer
            direction="right"
            open={mobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
          >
            <DrawerTrigger>
              <span className="sr-only">메뉴 열기</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="black"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </DrawerTrigger>
            <DrawerPortal>
              <DrawerOverlay className="fixed inset-0 bg-black/40" />
              <DrawerContent className="bg-white flex flex-col rounded-tl-sm rounded-bl-sm h-full w-[360px] pt-6 fixed bottom-0 right-0 lg:hidden">
                <div className="p-4 flex-1 h-full">
                  <div className="max-w-md mx-auto">
                    <DrawerTitle className="font-medium mb-4 flex justify-center items-center">
                      <div className="w-32 h-8 relative">
                        <Link href={URLS.HOME}>
                          <Image
                            src="/logo_green.png"
                            alt="home_logo"
                            fill
                            sizes="75"
                          />
                        </Link>
                      </div>
                    </DrawerTitle>
                    <MoblieHeaderContent
                      hydrated={hydrated}
                      accessToken={accessToken}
                      onChangeMobileMenuOpen={onChangeMobileMenuOpen}
                    />
                  </div>
                </div>
              </DrawerContent>
            </DrawerPortal>
          </Drawer>
        </div>
      </NavigationMenu>
      {/* </nav> */}
    </header>
  );
};

const MoblieHeaderContent = ({
  hydrated,
  accessToken,
  onChangeMobileMenuOpen,
}: {
  hydrated: boolean;
  accessToken: string | null;
  onChangeMobileMenuOpen: () => void;
}) => {
  return (
    <div className="flex flex-col gap-4 lg:hidden">
      <Link
        href={URLS.LOGIN}
        className="font-semibold leading-6 text-gray-900"
        onClick={onChangeMobileMenuOpen}
      >
        <UlButton
          text={
            !hydrated
              ? "로딩중.."
              : accessToken !== null
              ? "마이페이지"
              : "로그인"
          }
          enText=""
        />
      </Link>
      <Link
        href={URLS.COMPANY}
        className="font-semibold leading-6 text-gray-900"
        onClick={onChangeMobileMenuOpen}
      >
        <UlButton text="고운황금손" enText="Gold Baby" />
      </Link>
      <UlButton
        text="산후관리사"
        enText="Service"
        isAccordion={true}
        accordionChildren={
          <div className="w-full flex flex-col justify-center items-center gap-6 pt-6 text-base">
            <Link
              href={URLS.MANAGER.ABOUT}
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={onChangeMobileMenuOpen}
            >
              산후관리사란?
            </Link>
            <Link
              href={URLS.MANAGER.WORK}
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={onChangeMobileMenuOpen}
            >
              산후관리사가 하는 일
            </Link>
          </div>
        }
      />
      <UlButton
        text="이용안내"
        enText="Price"
        isAccordion={true}
        accordionChildren={
          <div className="w-full flex flex-col justify-center items-center gap-4 py-3">
            <Link
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={onChangeMobileMenuOpen}
            >
              대여물품
            </Link>
            <Link
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={onChangeMobileMenuOpen}
            >
              이용요금
            </Link>
            <Link
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={onChangeMobileMenuOpen}
            >
              정부지원바우처
            </Link>
          </div>
        }
      />
      <Link
        href="#"
        className="text-sm font-semibold leading-6 text-gray-900"
        onClick={onChangeMobileMenuOpen}
      >
        <UlButton text="지점안내" enText="Franchisee" />
      </Link>
      <UlButton
        text="예약상담"
        enText="Consult"
        isAccordion={true}
        accordionChildren={
          <div className="w-full flex flex-col justify-center items-center gap-4 py-3">
            <Link
              href={URLS.RESERVATION.APPLY}
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={onChangeMobileMenuOpen}
            >
              상담신청
            </Link>
            <Link
              href={URLS.RESERVATION.LIST}
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={onChangeMobileMenuOpen}
            >
              신청목록
            </Link>
          </div>
        }
      />
      <Link
        href={URLS.REVIEW}
        className="text-sm font-semibold leading-6 text-gray-900"
        onClick={onChangeMobileMenuOpen}
      >
        <UlButton text="이용후기" enText="Review" />
      </Link>
      <Link
        href="#"
        className="text-sm font-semibold leading-6 text-gray-900"
        onClick={onChangeMobileMenuOpen}
      >
        <UlButton text="오시는길" enText="Location" />
      </Link>
    </div>
  );
};

const UlButton = forwardRef(
  (
    {
      text,
      enText,
      isAccordion,
      accordionChildren,
    }: {
      text: string;
      enText?: string;
      isAccordion?: boolean;
      accordionChildren?: React.ReactNode;
    },
    ref
  ) => {
    return isAccordion ? (
      <Accordion type="single" collapsible className="lg:hidden text-black">
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex justify-center items-center relative py-2 text-sm font-semibold">
            {text}
          </AccordionTrigger>
          <AccordionContent>{accordionChildren}</AccordionContent>
        </AccordionItem>
      </Accordion>
    ) : (
      <ul
        className={cn(
          "flex flex-row justify-center items-center -space-y-2 px-4 py-2 lg:flex-col"
        )}
      >
        <div className="text-sm">{text}</div>
        {!!enText && (
          <div className="text-[10px] text-[#728146] hidden lg:block">
            {enText}
          </div>
        )}
      </ul>
    );
  }
);

UlButton.displayName = "UlButton";
