'use client';

import { cn } from '@/lib/utils';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';

import { PriceSummaryCard } from './PriceSummaryCard';

export const PriceList = () => {
  return (
    <FadeInWhenVisible delay={0.5}>
      <SectionTitle title="고운황금손 이용요금" />
      <div className={cn('mt-12 grid grid-cols-1 gap-6', 'md:grid-cols-2', 'xl:grid-cols-4')}>
        <PriceSummaryCard
          description="산후관리사가 산모 집으로 직접 찾아와요"
          iconSrc="/icon/taxi.png"
          priceList={[
            { type: '베이직', week: '1주', price: 850000 },
            { type: '프리미엄', week: '1주', price: 900000 },
          ]}
          title="출퇴근형"
        />
        <PriceSummaryCard
          description="산모 집에서 산후관리사가 매일 함께해요"
          iconSrc="/icon/return home.png"
          priceList={[
            { type: '주5일', week: '1주', price: 1350000 },
            { type: '주6일', week: '1주', price: 1600000 },
          ]}
          title="입주형"
        />
        <PriceSummaryCard
          description="오전 및 오후에만 돌봐드려요"
          iconSrc="/icon/sun.png"
          priceList={[{ type: '반일', week: '1주', price: 600000 }]}
          title="오전, 오후 돌봄"
        />
        <PriceSummaryCard
          description="원하는 날 하루만 돌봐드려요"
          iconSrc="/icon/calendar.png"
          priceList={[{ type: '8시간', week: '하루', price: 200000 }]}
          title="하루돌봄"
        />
      </div>
    </FadeInWhenVisible>
  );
};
