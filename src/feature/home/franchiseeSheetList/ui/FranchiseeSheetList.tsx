import { BRANCHES } from '@/app/franchisee/franchisee.config';
import { cn } from '@/lib/utils';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';

import Row from './_Row';

export function FranchiseeSheetList() {
  const items = BRANCHES.map(branch => ({
    title: branch.title,
    address: branch.address,
    phoneNumber: branch.phoneNumber,
    naverPlaceUrl: branch.naverPlaceUrl,
  }));

  return (
    <FadeInWhenVisible>
      <SectionTitleHero description="고운황금손 지점을 소개합니다." label="고운황금손 지점 소개" />
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
