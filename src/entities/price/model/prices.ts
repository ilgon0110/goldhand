export type TFeeRow = { id: string; label: string; values: number[] };

// 주 단위 요금은 [1주, 2주, 3주, 4주], 부가 요금 values는 [출퇴근형, 입주형]
export type TPrices = {
  holidayExtraPriceList: number[];
  basicPriceList: number[];
  premiumPriceList: number[];
  premiumHouseFiveDayPriceList: number[];
  premiumHouseSixDayPriceList: number[];
  costEffectivenessPriceList: number[];
  oneDayPriceList: number[];
  childExtraFeeList: TFeeRow[];
  otherExtraFeeList: TFeeRow[];
};

export type TPriceData = { prices: TPrices; revision: number };

// 저장 요청 검증: template(현재 저장된 요금)과 같은 형태여야 하고, 금액은 0 이상 정수, label은 1~200자, 그 외 문자열(id)은 template과 일치
export function validPriceData(value: unknown, template: unknown, key?: string): boolean {
  if (typeof template === 'number') return Number.isSafeInteger(value) && (value as number) >= 0;
  if (typeof template === 'string')
    return key === 'label'
      ? typeof value === 'string' && value.trim().length > 0 && value.length <= 200
      : value === template;
  if (Array.isArray(template))
    return (
      Array.isArray(value) &&
      value.length === template.length &&
      template.every((item, i) => validPriceData(value[i], item))
    );
  if (!value || typeof value !== 'object' || !template || typeof template !== 'object') return false;
  const expected = template as Record<string, unknown>;
  return (
    Object.keys(value).length === Object.keys(expected).length &&
    Object.entries(expected).every(([k, item]) => validPriceData((value as Record<string, unknown>)[k], item, k))
  );
}
