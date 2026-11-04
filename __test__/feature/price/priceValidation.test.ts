import { validPriceData } from '@/src/entities/price/model/prices';

import { PRICES } from '../../fixtures/prices';

// id·금액·키 구조 검증은 route.test.ts가 실제 요금 구조로 다룬다. 여기서는 항목명 경계값만 본다.
const { otherExtraFeeList } = PRICES;

const template = { rows: otherExtraFeeList };

const withLabel = (label: string) => {
  const value = structuredClone(template);
  value.rows[0].label = label;
  return value;
};

it('항목명은 200자까지 허용한다', () => {
  expect(validPriceData(withLabel('x'.repeat(200)), template)).toBe(true);
});

it.each(['', '   ', 'x'.repeat(201)])('유효하지 않은 항목명을 거부한다: "%s"', label => {
  expect(validPriceData(withLabel(label), template)).toBe(false);
});
