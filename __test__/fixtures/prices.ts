import type { TPrices } from '@/src/entities/price/model/prices';

// 테스트용 요금 데이터. 운영 요금은 Firestore settings/pricing 문서가 유일한 출처다.
export const PRICES: TPrices = {
  holidayExtraPriceList: [200000],
  basicPriceList: [820000, 1600000, 2400000, 3200000],
  premiumPriceList: [850000, 1650000, 2460000, 3280000],
  premiumHouseFiveDayPriceList: [1450000, 2600000, 3900000, 5200000],
  premiumHouseSixDayPriceList: [1670000, 3150000, 4650000, 6200000],
  costEffectivenessPriceList: [500000, 960000, 1450000, 1920000],
  oneDayPriceList: [180000],
  childExtraFeeList: [
    { id: 'child-under-20-months', label: '미취학 20개월 미만', values: [12000, 20000] },
    { id: 'child-school-age', label: '유치원 ~ 초등학생 이상', values: [5000, 10000] },
  ],
  otherExtraFeeList: [
    { id: 'adult-family', label: '남편 재택근무 및 성인가족 추가', values: [5000, 5000] },
    { id: 'overtime', label: '시간연장 (시간당)', values: [20000, 20000] },
    { id: 'holiday', label: '명절 휴일 추가', values: [70000, 100000] },
    { id: 'twins-experienced', label: '쌍둥이 추가(경력자)', values: [5000, 10000] },
    { id: 'twins-care', label: '쌍둥이 케어', values: [50000, 60000] },
  ],
};
