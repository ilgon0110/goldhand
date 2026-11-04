'use client';

import Link from 'next/link';

import { cn } from '@/lib/utils';
import { usePriceQuery } from '@/src/entities/price';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';
import { formatPrice } from '@/src/shared/utils';

import { CHILD_EXTRA_NOTE, commuteCheckList, dayoffCheckList, inHouseCheckList, WEEKS } from '../config/const';
import { getExtraNote, getHolidayNote, getOneDayNotes } from '../lib/notes';
import { PlanBlock, PlanNav, PlanSection, PriceHero } from './_PlanLayout';
import { PriceTable } from './_PriceTable';

// 주 단위 요금 리스트 여러 개를 [1주~4주] 행으로 묶는다.
const toWeekRows = (lists: number[][]) => WEEKS.map((label, i) => ({ label, values: lists.map(list => list[i]) }));

const EXTRA_COLUMNS = ['출퇴근형 (일당)', '입주형 (일당)'];

export const PricePage = ({ isAdmin }: { isAdmin: boolean }) => {
  const { prices } = usePriceQuery().data;

  return (
    // 바로가기 앵커의 부드러운 스크롤: JS 없이 이 페이지가 렌더된 동안만 html에 scroll-behavior: smooth 적용
    <div className={cn('break-keep', 'motion-safe:[html:has(&)]:scroll-smooth')}>
      <FadeInWhenVisible>
        <PriceHero
          eyebrow="고운황금손 이용요금"
          title={
            <>
              산모님의 상황에 맞춰 선택하실 수 있도록
              <br className={cn('hidden', 'md:block')} /> 유형별 요금을 안내해 드립니다.
            </>
          }
        >
          <PlanNav>
            {isAdmin && (
              <Link
                className="ml-auto inline-flex h-10 shrink-0 items-center justify-center rounded-full border border-goldDeep bg-goldDeep px-4 text-sm font-semibold text-white transition-colors hover:bg-goldDeep/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-goldDeep focus-visible:ring-offset-2"
                href="/price/manage"
              >
                이용요금 관리하기
              </Link>
            )}
          </PlanNav>
        </PriceHero>
      </FadeInWhenVisible>

      <PlanSection desc="기간 단위로 이용하시는 출퇴근형과 입주형 요금입니다." title="주간 케어 요금">
        <FadeInWhenVisible>
          <PlanBlock
            desc="산후관리사가 산모님 댁으로 방문해요."
            id="commute"
            notes={[...commuteCheckList, getHolidayNote(prices)]}
            title="출퇴근형"
          >
            <PriceTable
              caption="출퇴근형 베이직·프리미엄 이용요금표"
              columns={['베이직', '프리미엄']}
              labelHeader="기간"
              rows={toWeekRows([prices.basicPriceList, prices.premiumPriceList])}
            />
          </PlanBlock>
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <PlanBlock desc="산모님 댁에서 산후관리사가 함께해요." id="live-in" notes={inHouseCheckList} title="입주형">
            <PriceTable
              caption="입주형 주5일·주6일 이용요금표"
              columns={['주5일 입주형', '주6일 입주형']}
              labelHeader="기간"
              rows={toWeekRows([prices.premiumHouseFiveDayPriceList, prices.premiumHouseSixDayPriceList])}
            />
          </PlanBlock>
        </FadeInWhenVisible>
      </PlanSection>

      <PlanSection desc="필요한 시간만큼 가볍게 이용하실 수 있는 단기 케어입니다." title="단기 돌봄 요금">
        <FadeInWhenVisible>
          <PlanBlock
            desc="오전 또는 오후 시간대에만 돌봐드려요."
            id="half-day"
            notes={dayoffCheckList}
            title="오전·오후 돌봄"
          >
            <PriceTable
              caption="오전·오후 돌봄 이용요금표"
              columns={['요금']}
              labelHeader="기간"
              rows={toWeekRows([prices.costEffectivenessPriceList])}
            />
          </PlanBlock>
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <PlanBlock
            desc="원하시는 날, 하루만 돌봐드려요."
            id="one-day"
            notes={getOneDayNotes(prices)}
            title="하루돌봄"
          >
            {/* 요금이 하나뿐이라 표 대신 단일 수치로 보여준다 */}
            <div
              className={cn(
                'flex items-center justify-between gap-6 rounded-2xl border border-border px-5 py-6',
                'md:px-6',
              )}
            >
              <span className="font-semibold text-muted-foreground">8시간</span>
              <span className={cn('text-2xl font-bold tabular-nums text-foreground', 'md:text-3xl')}>
                {formatPrice(prices.oneDayPriceList[0])}
              </span>
            </div>
          </PlanBlock>
        </FadeInWhenVisible>
      </PlanSection>

      <PlanSection
        className={cn('pb-0', 'md:pb-0')}
        desc="기본 요금 외 추가되는 항목을 출퇴근형·입주형으로 나누어 안내드립니다."
        id="extra"
        title="부가서비스"
      >
        <FadeInWhenVisible>
          <PlanBlock notes={[CHILD_EXTRA_NOTE]} title="큰아이 추가비용">
            <PriceTable
              caption="큰아이 추가비용: 출퇴근형 및 입주형 비교"
              columns={EXTRA_COLUMNS}
              labelHeader="항목"
              rows={prices.childExtraFeeList}
            />
          </PlanBlock>
        </FadeInWhenVisible>
        <FadeInWhenVisible>
          <PlanBlock notes={[getExtraNote(prices)]} title="기타 추가비용">
            <PriceTable
              caption="기타 추가비용: 출퇴근형 및 입주형 비교"
              columns={EXTRA_COLUMNS}
              labelHeader="항목"
              rows={prices.otherExtraFeeList}
            />
          </PlanBlock>
        </FadeInWhenVisible>
      </PlanSection>
    </div>
  );
};
