import type { TPrices } from '@/src/entities/price';
import { formatPrice } from '@/src/shared/utils';

// 저장 검증이 id를 고정하므로 overtime 행은 항상 존재한다.
const overtimeOf = (prices: TPrices) => prices.otherExtraFeeList.find(row => row.id === 'overtime')!.values;

export function getOvertimeNote(prices: TPrices) {
  const [commute, liveIn] = overtimeOf(prices);
  return commute === liveIn
    ? `근무시간 외 1시간 당 ${formatPrice(commute)}`
    : `근무시간 외 1시간 당 출퇴근형 ${formatPrice(commute)} / 입주형 ${formatPrice(liveIn)}`;
}

export const getHolidayNote = (prices: TPrices) =>
  `일요일 및 공휴일 09:00 ~ 17:00 (${formatPrice(prices.holidayExtraPriceList[0])} 추가)`;

export const getOneDayNotes = (prices: TPrices) => [
  '09:00 ~ 15:00 / 10:00 ~ 16:00',
  `${getOvertimeNote(prices)}이 추가됩니다.`,
  '1일부터 3일까지 이용 가능합니다.',
];

export const getExtraNote = (prices: TPrices) => `근무시간 09:00 ~ 15:00 / 10:00 ~ 16:00 · ${getOvertimeNote(prices)}`;
