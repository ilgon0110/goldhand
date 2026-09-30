import { PiCurrencyKrw } from 'react-icons/pi';

import { cn } from '@/lib/utils';
import {
  basicPriceList,
  childExtraFeeList,
  commuteCheckList,
  costEffectivenessPriceList,
  dayoffCheckList,
  inHouseCheckList,
  onDayCheckList,
  oneDayPriceList,
  otherExtraFeeList,
  premiumHouseFiveDayPriceList,
  premiumHouseSixDayPriceList,
  premiumPriceList,
  PriceTable,
} from '@/src/feature/price';
import FadeInWhenVisible from '@/src/shared/ui/FadeInWhenVisible';
import { formatPrice } from '@/src/shared/utils';

// 타입 스케일은 /manager·/rental 페이지와 동일하게 맞춘다: h1 24/30/36, h2 20/24/30, h3 18/20
// 계층 구분: 섹션(h2)은 진한 2px 선으로 시작한다.
// 섹션 간 간격 > 섹션 내 유형 간 간격으로 두어 근접성으로도 그룹이 읽히게 한다.
const SECTION = cn('border-t-2 border-foreground pb-24 pt-10', 'md:pb-32 md:pt-12');
const PLAN_GROUP = cn('mt-10 space-y-12', 'md:mt-12 md:space-y-16');
const H2 = cn('break-keep text-xl font-bold leading-[1.35] text-foreground', 'md:text-2xl', 'xl:text-3xl');
const WEEKS = ['1주', '2주', '3주', '4주'];

const toRows = (lists: number[][]) => WEEKS.map((label, i) => ({ label, values: lists.map(list => list[i]) }));

const CHILD_EXTRA_NOTE = '오전·오후 돌봄은 큰아이·성인·휴일 추가비가 종일제 기준 50%만 적용됩니다.';
const WORK_HOURS_NOTE = '근무시간 09:00 ~ 15:00 / 10:00 ~ 16:00 · 근무시간 외 1시간 당 20,000원';

const PLAN_LINKS = [
  { id: 'commute', label: '출퇴근형' },
  { id: 'live-in', label: '입주형' },
  { id: 'half-day', label: '오전·오후 돌봄' },
  { id: 'one-day', label: '하루돌봄' },
  { id: 'extra', label: '부가서비스' },
];

// 유형 하나: 좌측 이름·설명·유의사항, 우측 요금. 4개 유형 모두 같은 구조로 반복해 비교하기 쉽게 한다.
function PlanBlock({
  id,
  title,
  desc,
  notes,
  children,
}: {
  id?: string;
  title: string;
  desc?: string;
  notes: string[];
  children: React.ReactNode;
}) {
  return (
    <FadeInWhenVisible>
      <div className={cn('grid scroll-mt-16 gap-6', 'lg:grid-cols-[1fr_1.4fr] lg:gap-12')} id={id}>
        <div>
          <h3 className={cn('text-lg font-bold text-foreground', 'md:text-xl')}>{title}</h3>
          {desc && <p className="mt-1.5 text-muted-foreground">{desc}</p>}
          <ul className={cn('list-disc space-y-2 pl-5 marker:text-goldDeep', desc ? 'mt-5' : 'mt-3')}>
            {notes.map(note => (
              <li className="text-sm leading-relaxed text-foreground/80" key={note}>
                {note}
              </li>
            ))}
          </ul>
        </div>
        <div>{children}</div>
      </div>
    </FadeInWhenVisible>
  );
}

const PricePage = () => {
  return (
    // 바로가기 앵커의 부드러운 스크롤: JS 없이 이 페이지가 렌더된 동안만 html에 scroll-behavior: smooth 적용
    <div className={cn('break-keep', 'motion-safe:[html:has(&)]:scroll-smooth')}>
      {/* 1. 제목 + 유형 바로가기 */}
      <div className={cn('pb-16 pt-16', 'md:pb-20 md:pt-24')}>
        <FadeInWhenVisible>
          <h1 className="space-y-4">
            <span className="flex items-center gap-2 text-base font-bold text-goldDeep">
              <PiCurrencyKrw aria-hidden="true" className="h-5 w-5" />
              고운황금손 이용요금
            </span>
            <span
              className={cn(
                'block text-2xl font-bold leading-[1.3] tracking-[-0.01em] text-foreground [text-wrap:balance]',
                'md:text-3xl md:leading-[1.3]',
                'xl:text-4xl xl:leading-[1.3]',
              )}
            >
              산모님의 상황에 맞춰 선택하실 수 있도록
              <br className={cn('hidden', 'md:block')} /> 유형별 요금을 안내해 드립니다.
            </span>
          </h1>
          <nav aria-label="요금 유형 바로가기" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {PLAN_LINKS.map(({ id, label }) => (
                <li key={id}>
                  <a
                    className={cn(
                      'inline-flex h-10 items-center rounded-full border border-border px-4 text-sm font-semibold text-foreground transition-colors duration-200',
                      'hover:border-gold/60 hover:text-goldDeep',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-goldDeep',
                    )}
                    href={`#${id}`}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </FadeInWhenVisible>
      </div>

      {/* 2. 주간 케어 요금 */}
      <div className={SECTION}>
        <div className="max-w-[65ch] space-y-3">
          <h2 className={H2}>주간 케어 요금</h2>
          <p className={cn('text-muted-foreground', 'md:text-lg')}>
            기간 단위로 이용하시는 출퇴근형과 입주형 요금입니다.
          </p>
        </div>
        <div className={PLAN_GROUP}>
          <PlanBlock desc="산후관리사가 산모님 댁으로 방문해요." id="commute" notes={commuteCheckList} title="출퇴근형">
            <PriceTable
              caption="출퇴근형 베이직·프리미엄 이용요금표"
              columns={['베이직', '프리미엄']}
              labelHeader="기간"
              rows={toRows([basicPriceList, premiumPriceList])}
            />
          </PlanBlock>
          <PlanBlock desc="산모님 댁에서 산후관리사가 함께해요." id="live-in" notes={inHouseCheckList} title="입주형">
            <PriceTable
              caption="입주형 주5일·주6일 이용요금표"
              columns={['주5일 입주형', '주6일 입주형']}
              labelHeader="기간"
              rows={toRows([premiumHouseFiveDayPriceList, premiumHouseSixDayPriceList])}
            />
          </PlanBlock>
        </div>
      </div>

      {/* 3. 단기 돌봄 요금 */}
      <div className={SECTION}>
        <div className="max-w-[65ch] space-y-3">
          <h2 className={H2}>단기 돌봄 요금</h2>
          <p className={cn('text-muted-foreground', 'md:text-lg')}>
            필요한 시간만큼 가볍게 이용하실 수 있는 단기 케어입니다.
          </p>
        </div>
        <div className={PLAN_GROUP}>
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
              rows={toRows([costEffectivenessPriceList])}
            />
          </PlanBlock>
          <PlanBlock desc="원하시는 날, 하루만 돌봐드려요." id="one-day" notes={onDayCheckList} title="하루돌봄">
            {/* 요금이 하나뿐이라 표 대신 단일 수치로 보여준다 */}
            <div
              className={cn(
                'flex items-center justify-between gap-6 rounded-2xl border border-border px-5 py-6',
                'md:px-6',
              )}
            >
              <span className="font-semibold text-muted-foreground">8시간</span>
              <span className={cn('text-2xl font-bold tabular-nums text-foreground', 'md:text-3xl')}>
                {formatPrice(oneDayPriceList[0])}
              </span>
            </div>
          </PlanBlock>
        </div>
      </div>

      {/* 4. 부가서비스 */}
      <div className={cn(SECTION, 'scroll-mt-16 pb-0 md:pb-0')} id="extra">
        <div className="max-w-[65ch] space-y-3">
          <h2 className={H2}>부가서비스</h2>
          <p className={cn('text-muted-foreground', 'md:text-lg')}>
            기본 요금 외 추가되는 항목을 출퇴근형·입주형으로 나누어 안내드립니다.
          </p>
        </div>
        <div className={PLAN_GROUP}>
          <PlanBlock notes={[CHILD_EXTRA_NOTE]} title="큰아이 추가비용">
            <PriceTable
              caption="큰아이 추가비용: 출퇴근형 및 입주형 비교"
              columns={['출퇴근형 (일당)', '입주형 (일당)']}
              labelHeader="항목"
              rows={childExtraFeeList}
            />
          </PlanBlock>
          <PlanBlock notes={[WORK_HOURS_NOTE]} title="기타 추가비용">
            <PriceTable
              caption="기타 추가비용: 출퇴근형 및 입주형 비교"
              columns={['출퇴근형 (일당)', '입주형 (일당)']}
              labelHeader="항목"
              rows={otherExtraFeeList}
            />
          </PlanBlock>
        </div>
      </div>
    </div>
  );
};

export default PricePage;
