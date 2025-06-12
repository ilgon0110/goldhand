'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';

import {
  basicCheckList,
  basicPriceList,
  costEffectivenessCheckList,
  costEffectivenessPriceList,
  premiumCheckList,
  premiumHouseFiveDayPriceList,
  premiumHouseSixDayCheckList,
  premiumHouseSixDayPriceList,
  premiumPriceList,
  PriceCard,
} from '../index';

export const PriceList = () => {
  const router = useRouter();
  const [type, setType] = useState<'실속형' | '입주형' | '출퇴근형'>('출퇴근형');
  const onChangeType = (type: string) => {
    setType(type as '실속형' | '입주형' | '출퇴근형');
  };

  const onClickButtonTitle = () => {
    router.push('/price');
  };

  return (
    <div>
      <SectionTitle
        buttonTitle="이용요금 보러가기"
        title="고운황금손 이용요금"
        onClickButtonTitle={onClickButtonTitle}
      />
      <div className="mt-10 flex h-fit flex-row items-center justify-center gap-7">
        <TypeButton selectedType={type} type="출퇴근형" onChangeType={onChangeType} />
        <div className="h-8 w-[1px] bg-[#D9D9D9]" />
        <TypeButton selectedType={type} type="입주형" onChangeType={onChangeType} />
        <div className="h-8 w-[1px] bg-[#D9D9D9]" />
        <TypeButton selectedType={type} type="실속형" onChangeType={onChangeType} />
      </div>
      <div className="mt-16 flex flex-col items-baseline justify-center gap-12 md:flex-row">
        {type === '출퇴근형' && (
          <>
            <PriceCard
              checkList={basicCheckList}
              description="주 5일 출퇴근. 베이직이 뭔지 설명 간단하게"
              priceList={basicPriceList}
              title="베이직"
            />
            <PriceCard
              checkList={premiumCheckList}
              description="주 5일 출퇴근. 왜 베이직 안쓰고 프리미엄 써야되는지 소개"
              priceList={premiumPriceList}
              title="프리미엄"
            />
          </>
        )}
        {type === '입주형' && (
          <>
            <PriceCard
              checkList={premiumHouseSixDayCheckList}
              description="주5일 입주형(프리미엄) 설명 간단하게"
              priceList={premiumHouseFiveDayPriceList}
              title="프리미엄(주5일 입주형)"
            />
            <PriceCard
              checkList={premiumHouseSixDayCheckList}
              description="주6일 입주형(프리미엄) 설명 간단하게"
              priceList={premiumHouseSixDayPriceList}
              title="프리미엄(주6일 입주형)"
            />
          </>
        )}
        {type === '실속형' && (
          <PriceCard
            checkList={costEffectivenessCheckList}
            description="평일 09:00 ~ 14:00/평일 10:00 ~ 15:00"
            priceList={costEffectivenessPriceList}
            title="실속형"
          />
        )}
      </div>
    </div>
  );
};

const TypeButton = ({
  type,
  selectedType,
  onChangeType,
}: {
  type: string;
  selectedType: string;
  onChangeType: (type: string) => void;
}) => {
  const onClick = () => {
    onChangeType(type);
  };
  return (
    <button
      className={cn('text-base font-bold md:text-3xl', type === selectedType ? 'text-[#0F2E16]' : 'text-[#878787]')}
      onClick={onClick}
    >
      {type}
    </button>
  );
};
