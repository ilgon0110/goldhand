'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { gowunDodumFont } from '@/src/shared/fonts';
import { PrivacyModal } from '@/widgets/Privacy';

export const Footer = () => {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  return (
    <>
      {privacyModalOpen && <PrivacyModal handleClose={() => setPrivacyModalOpen(false)} isOpen={privacyModalOpen} />}
      <footer className="relative mt-20 w-full whitespace-nowrap border-gray-300 bg-[#FAFAFA] pb-3 pt-10">
        <div className="flex flex-col justify-center gap-12 px-[10vw] transition-all duration-300 ease-in-out md:flex-row md:items-start md:justify-normal">
          <div className="flex flex-col items-center justify-center space-y-4 xl:block">
            <div className="flex flex-row items-center space-x-2">
              <Image alt="고운황금손" height={32} src="/favicon-96x96.png" width={32} />
              <span className={`${gowunDodumFont.className} font-bold text-gray-700`}>고운황금손</span>
            </div>
            <div className="space-y-2 text-center xl:text-start">
              <div className="flex flex-row items-center justify-center space-x-2 xl:justify-normal">
                <svg
                  fill="#728146"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M760-480q0-117-81.5-198.5T480-760v-80q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480h-80Zm-160 0q0-50-35-85t-85-35v-80q83 0 141.5 58.5T680-480h-80Zm198 360q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12ZM241-600l66-66-17-94h-89q5 41 14 81t26 79Zm358 358q39 17 79.5 27t81.5 13v-88l-94-19-67 67ZM241-600Zm358 358Z" />
                </svg>
                <p className="text-balance text-lg text-[#728146]">010-8381-0431</p>
              </div>
              <span className="text-balance text-sm/6 text-gray-600">
                궁금하신 점 또는 문의 사항이 있으시면 언제든지 연락해주세요.
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center text-center md:items-start md:text-base">
            <Link className="font-semibold text-gray-900" href="/company">
              회사소개
            </Link>
            <p className="mt-2 text-balance text-sm/6 text-gray-600">대표 : 차복규</p>
            <p className="text-balance text-sm/6 text-gray-600">
              주소 : 경기도 화성시 향남읍 상신하길로328번길 26(하길리 1467) 505호
            </p>
            <p className="text-balance text-sm/6 text-gray-600">사업자등록번호 : 614-94-02053</p>
          </div>
          <button className="font-semibold text-gray-900" onClick={() => setPrivacyModalOpen(true)}>
            개인정보처리방침
          </button>
        </div>
        <div className="mt-8 flex w-full flex-row justify-between border-t border-gray-900/10 px-[10vw] pt-3">
          <p className="text-sm/6 text-gray-600">&copy; 2024 고운황금손, Inc. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};
