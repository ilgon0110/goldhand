'use client';

import { cn } from '@/lib/utils';
import { franchiseeList } from '@/src/shared/config';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';

import Row from './_Row';

export function FranchiseeSheetList() {
  const items = franchiseeList
    .map(franchisee => ({
      title: franchisee,
      address: franchisee.includes('화성') ? '경기도 화성시 향남읍 상신하길로' : '경기도 수원시 팔달구 인계로',
      phoneNumber: franchisee.includes('화성') ? '010-8381-0431' : '010-4437-0431',
      naverPlaceUrl: franchisee.includes('화성') ? 'https://naver.me/FBepMjL3' : 'https://naver.me/xpB4oXiI',
    }))
    .filter(item => item.title !== '전체');

  return (
    <FadeInWhenVisible>
      <SectionTitle title="고운황금손 지점 소개" />
      <div className={cn('mt-9 w-fit rounded-t-md bg-[#728146] px-7 py-2 text-base text-white')}>경기도</div>
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
  );
}
