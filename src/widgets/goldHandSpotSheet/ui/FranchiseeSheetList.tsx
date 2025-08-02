'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { franchiseeList } from '@/src/shared/config';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';

import Row from './row';

export function FranchiseeSheetList() {
  const [location, setLocation] = useState<string>('경기도');
  const router = useRouter();

  const onClickLocation = (location: string) => {
    setLocation(location);
  };

  const items = franchiseeList
    .map(franchisee => ({
      title: franchisee,
      address: franchisee.includes('화성') ? '경기도 화성시 향남읍 상신하길로' : '경기도 수원시 팔달구 인계로',
      phoneNumber: franchisee.includes('화성') ? '010-8381-0431' : '010-5536-3765',
      naverPlaceUrl: franchisee.includes('화성') ? 'https://naver.me/FBepMjL3' : 'https://naver.me/xpB4oXiI',
    }))
    .filter(item => item.title !== '전체');

  return (
    <div>
      <FadeInWhenVisible>
        <SectionTitle
          buttonTitle=""
          title="고운황금손 지점 소개"
          onClickButtonTitle={() => router.push('/franchisee')}
        />
        <button
          className="mt-9 rounded-t-md bg-[#728146] px-7 py-2 text-base text-white hover:opacity-80"
          onClick={() => onClickLocation('경기')}
        >
          경기도
        </button>
        <div className="h-[1px] w-full bg-gray-300" />
        <div className="my-3 space-y-3">
          {items.map((item, index) => (
            <div key={item.title}>
              <Row {...item} />
              {index + 1 !== items.length && <div className="mt-2 w-full border-b border-slate-300 px-0" />}
            </div>
          ))}
        </div>
        <div className="h-[1px] w-full bg-gray-300" />
      </FadeInWhenVisible>
    </div>
  );
}
