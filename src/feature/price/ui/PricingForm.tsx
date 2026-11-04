'use client';

import { useState } from 'react';
import { type FieldPath, useForm } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { type TFeeRow, type TPrices, usePriceQuery, useUpdatePriceMutation } from '@/src/entities/price';
import { Button } from '@/src/shared/ui/button';
import { Form } from '@/src/shared/ui/form';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { toastError, toastSuccess } from '@/src/shared/utils';

import { CHILD_EXTRA_NOTE, commuteCheckList, dayoffCheckList, inHouseCheckList, WEEKS } from '../config/const';
import { getExtraNote, getOneDayNotes } from '../lib/notes';
import { PlanBlock, PlanNav, PlanSection, PriceHero } from './_PlanLayout';
import { PriceInput } from './_PriceInput';

// 표는 PriceTable과 같은 틀(둥근 박스, 옅은 헤더, 금색 열 제목, 가로 구분선)에 금액 대신 입력칸을 둔다.
const TABLE_BOX = 'overflow-hidden rounded-2xl border border-border';
const HEAD_LABEL = cn('px-3 py-3.5 text-left font-semibold text-muted-foreground', 'md:px-5');
const HEAD_VALUE = cn('w-px whitespace-nowrap px-3 py-3.5 text-right font-semibold text-goldDeep', 'md:px-5');
const MONEY = cn('w-[116px]', 'md:w-[136px]');
const FEE_TYPES = ['출퇴근형', '입주형'];

type TWeekKey = {
  [K in keyof TPrices]: TPrices[K] extends number[] ? K : never;
}[keyof TPrices];
type TFeeKey = 'childExtraFeeList' | 'otherExtraFeeList';

function WeekTable({
  caption,
  columns,
}: {
  caption: string;
  columns: { header: string; label: string; key: TWeekKey }[];
}) {
  return (
    <div className={TABLE_BOX}>
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-muted/50">
          <tr>
            <th className={HEAD_LABEL} scope="col">
              기간
            </th>
            {columns.map(column => (
              <th className={HEAD_VALUE} key={column.key} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {WEEKS.map((week, index) => (
            <tr className="border-t border-border" key={week}>
              <th className={cn('px-3 py-3 text-left font-medium text-foreground', 'md:px-5')} scope="row">
                {week}
              </th>
              {columns.map(column => (
                <td className={cn('w-px whitespace-nowrap px-3 py-3 align-top', 'md:px-5')} key={column.key}>
                  <PriceInput className={MONEY} label={`${column.label} ${week}`} name={`${column.key}.${index}`} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 항목명 + 출퇴근형·입주형 금액이 한 행. 모바일에서는 항목명이 윗줄 전체를 쓰고 금액 두 칸이 아래로 내려간다.
function FeeTable({ caption, listKey, rows }: { caption: string; listKey: TFeeKey; rows: TFeeRow[] }) {
  return (
    <div className={TABLE_BOX}>
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className={cn('hidden bg-muted/50', 'sm:table-header-group')}>
          <tr>
            <th className={HEAD_LABEL} scope="col">
              항목
            </th>
            {FEE_TYPES.map(type => (
              <th className={HEAD_VALUE} key={type} scope="col">
                {type} (일당)
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => {
            const unit = row.id === 'overtime' ? '시간당' : '일당';
            return (
              <tr
                className={cn(
                  'grid grid-cols-2 gap-x-3 gap-y-2.5 border-t border-border px-3 py-3.5 first:border-t-0',
                  'sm:table-row sm:p-0 sm:first:border-t',
                )}
                key={row.id}
              >
                <th className={cn('col-span-2 p-0 text-left font-medium', 'sm:px-3 sm:py-3', 'md:px-5')} scope="row">
                  <PriceInput kind="label" label={`${row.label} 항목명`} name={`${listKey}.${rowIndex}.label`} />
                </th>
                {FEE_TYPES.map((type, typeIndex) => (
                  <td
                    className={cn('p-0', 'sm:w-px sm:whitespace-nowrap sm:px-3 sm:py-3 sm:align-top', 'md:px-5')}
                    key={type}
                  >
                    <span
                      aria-hidden="true"
                      className={cn('mb-1.5 block text-xs font-semibold text-goldDeep', 'sm:hidden')}
                    >
                      {`${type} (${unit})`}
                    </span>
                    <PriceInput
                      className={cn('w-full', 'sm:w-[116px]', 'md:w-[136px]')}
                      label={`${row.label} ${type} (${unit})`}
                      name={`${listKey}.${rowIndex}.values.${typeIndex}`}
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// 요금이 하나뿐인 항목은 /price의 하루돌봄처럼 표 대신 단일 카드로 둔다.
function SingleCard({
  title,
  sub,
  label,
  name,
}: {
  title: string;
  sub?: string;
  label: string;
  name: FieldPath<TPrices>;
}) {
  return (
    <div
      className={cn('flex items-center justify-between gap-6 rounded-2xl border border-border px-5 py-4', 'md:px-6')}
    >
      <div className="flex flex-col gap-0.5">
        <span className={cn('font-semibold', sub ? 'text-foreground' : 'text-muted-foreground')}>{title}</span>
        {sub && <span className="text-[13px] text-muted-foreground">{sub}</span>}
      </div>
      <PriceInput className={MONEY} label={label} name={name} />
    </div>
  );
}

export function PricingForm() {
  const { data } = usePriceQuery();
  const updatePrice = useUpdatePriceMutation();
  const form = useForm<TPrices>({ defaultValues: data.prices, mode: 'onChange' });
  // 폼 값과 짝인 revision. 편집 중 재조회로 캐시 revision이 올라가도 따라가지 않아야 409 충돌 검사가 동작한다.
  const [revision, setRevision] = useState(data.revision);
  const busy = updatePrice.isPending;

  const onSubmit = (prices: TPrices) =>
    updatePrice.mutate(
      { prices, revision },
      {
        onSuccess: saved => {
          setRevision(saved.revision);
          form.reset(prices);
          toastSuccess('저장했습니다.');
        },
        onError: error => toastError(error.message),
      },
    );

  return (
    // 바로가기 앵커의 부드러운 스크롤: /price와 같이 이 페이지가 렌더된 동안만 html에 scroll-behavior: smooth 적용
    <div className={cn('break-keep', 'motion-safe:[html:has(&)]:scroll-smooth')}>
      <PriceHero eyebrow="이용요금 관리" title="이용요금 수정하기">
        <p className={cn('mt-4 max-w-[65ch] text-muted-foreground', 'md:text-lg')}>
          수정한 가격은 메인 페이지와 이용요금 안내에 함께 반영됩니다.
        </p>
        <PlanNav />
      </PriceHero>

      <Form {...form}>
        <form aria-label="이용요금 수정" noValidate onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset className="min-w-0" disabled={busy}>
            <PlanSection desc="기간 단위로 이용하시는 출퇴근형과 입주형 요금입니다." title="주간 케어 요금">
              {/* 일요일·공휴일 추가 요금은 아래 입력 카드로 따로 두므로 유의사항에는 넣지 않는다. */}
              <PlanBlock
                desc="산후관리사가 산모님 댁으로 방문해요."
                id="commute"
                notes={commuteCheckList}
                title="출퇴근형"
              >
                <WeekTable
                  caption="출퇴근형 베이직·프리미엄 요금 입력"
                  columns={[
                    { header: '베이직', label: '출퇴근형 베이직', key: 'basicPriceList' },
                    { header: '프리미엄', label: '출퇴근형 프리미엄', key: 'premiumPriceList' },
                  ]}
                />
                <SingleCard
                  label="출퇴근형 일요일·공휴일 추가"
                  name="holidayExtraPriceList.0"
                  sub="09:00 ~ 17:00"
                  title="일요일·공휴일 추가"
                />
              </PlanBlock>
              <PlanBlock
                desc="산모님 댁에서 산후관리사가 함께해요."
                id="live-in"
                notes={inHouseCheckList}
                title="입주형"
              >
                <WeekTable
                  caption="입주형 주5일·주6일 요금 입력"
                  columns={[
                    { header: '주5일 입주형', label: '입주형 주5일', key: 'premiumHouseFiveDayPriceList' },
                    { header: '주6일 입주형', label: '입주형 주6일', key: 'premiumHouseSixDayPriceList' },
                  ]}
                />
              </PlanBlock>
            </PlanSection>

            <PlanSection desc="필요한 시간만큼 가볍게 이용하실 수 있는 단기 케어입니다." title="단기 돌봄 요금">
              <PlanBlock
                desc="오전 또는 오후 시간대에만 돌봐드려요."
                id="half-day"
                notes={dayoffCheckList}
                title="오전·오후 돌봄"
              >
                <WeekTable
                  caption="오전·오후 돌봄 요금 입력"
                  columns={[{ header: '요금', label: '오전·오후 돌봄', key: 'costEffectivenessPriceList' }]}
                />
              </PlanBlock>
              <PlanBlock
                desc="원하시는 날, 하루만 돌봐드려요."
                id="one-day"
                notes={getOneDayNotes(data.prices)}
                title="하루돌봄"
              >
                <SingleCard label="하루돌봄" name="oneDayPriceList.0" title="8시간" />
              </PlanBlock>
            </PlanSection>

            <PlanSection
              className={cn('pb-12', 'md:pb-12')}
              desc="기본 요금 외 추가되는 항목을 출퇴근형·입주형으로 나누어 안내드립니다."
              id="extra"
              title="부가서비스"
            >
              <PlanBlock notes={[CHILD_EXTRA_NOTE]} title="큰아이 추가비용">
                <FeeTable
                  caption="큰아이 추가비용 입력: 항목명, 출퇴근형, 입주형"
                  listKey="childExtraFeeList"
                  rows={data.prices.childExtraFeeList}
                />
              </PlanBlock>
              <PlanBlock notes={[getExtraNote(data.prices)]} title="기타 추가비용">
                <FeeTable
                  caption="기타 추가비용 입력: 항목명, 출퇴근형, 입주형"
                  listKey="otherExtraFeeList"
                  rows={data.prices.otherExtraFeeList}
                />
              </PlanBlock>
            </PlanSection>
          </fieldset>

          <div className="sticky bottom-0 z-10 mt-12 flex items-center justify-end gap-4 border-t border-border bg-background py-4">
            <Button
              className={cn(
                'h-11 rounded-full bg-goldDeep px-5 font-semibold text-white',
                'hover:bg-goldDeep/90 focus-visible:ring-goldDeep',
              )}
              disabled={busy}
              type="submit"
            >
              {busy ? (
                <>
                  <LoadingSpinnerIcon /> 저장 중
                </>
              ) : (
                '전체 저장'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
