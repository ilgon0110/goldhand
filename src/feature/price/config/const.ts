export const basicPriceList = [900000, 1600000, 2400000, 3200000];

export const commuteCheckList = [
  '1주·2주·3주·4주 단위별 금액이 상이합니다.',
  '주 5일 (월~금) 평일 09:00 ~ 18:00 (휴게시간 1시간 포함)',
  '큰아이 추가 및 성인 추가 금액은 별도입니다.',
  '토요일 09:00 ~ 14:00 (15만원 추가) / 09:00 ~ 17:00 (20만원 추가)',
  '일요일 및 공휴일 09:00 ~ 17:00 (20만원 추가)',
];

export const inHouseCheckList = [
  '일요일 19시 출근 ~ 금요일 15시 퇴근',
  '주 6일제 이용 시 토요일 15시 퇴근',
  '19시 업무 종료 후 신생아 집중 케어',
  '하루 3시간 휴게시간 포함',
];

export const dayoffCheckList = [
  '평일 09:00 ~ 14:00 / 평일 10:00 ~ 15:00',
  '점심식사 제공',
  '주 5일제 예약만 가능합니다.',
  '큰아이·성인·휴일 추가비는 종일제 기준 50%만 적용됩니다.',
];

export const onDayCheckList = [
  '09:00 ~ 15:00 / 10:00 ~ 16:00',
  '근무시간 외 1시간 당 20,000원이 추가됩니다.',
  '1일부터 3일까지 이용 가능합니다.',
];

export const premiumPriceList = [950000, 1700000, 2550000, 3400000];

export const premiumHouseFiveDayPriceList = [1450000, 2600000, 3900000, 5200000];

export const premiumHouseSixDayPriceList = [1650000, 3100000, 4650000, 6200000];

export const premiumHouseSixDayCheckList = ['일요일 19시 출근 ~ 금요일 15시 퇴근', '주 6일제 이용시 토요일 15시 퇴근'];

export const costEffectivenessPriceList = [620000, 1180000, 1770000, 2360000];

export const costEffectivenessCheckList = [
  '점심식사 제공',
  '주 5일제 예약만 가능',
  '큰아이 및 성인, 휴일 추가비는 종일제 기준으로 50%만 적용',
];

export const oneDayPriceList = [200000];

export const oneDayCheckList = ['1일부터 3일 까지 이용 가능'];

export const etcWorkOutCheckList = [
  '주5일 09:00 ~ 18:00 (휴게시간 1시간 포함)',
  '토요일 09:00 ~ 14:00 15만원 추가',
  '토요일 09:00 ~ 17:00 20만원 추가',
  '일요일 및 공휴일 09:00 ~ 17:00 20만원 추가',
];

export const etcInsertCheckList = [
  '일요일 19:00 ~ 금요일 15:00',
  '주 6일 (토요일 15:00 퇴실)',
  '저녁 7시 업무종료, 신생아 집중케어',
  '하루 3시간 휴게시간 포함',
];

// 그 외 추가 요금: [출퇴근형, 입주형]
export const childExtraFeeList = [
  { label: '미취학 20개월 미만', values: [15000, 20000] },
  { label: '미취학 20개월 이상', values: [10000, 15000] },
  { label: '어린이집·유치원', values: [6000, 10000] },
  { label: '어린이집 방학', values: [10000, 20000] },
  { label: '초등학교 이상 학생', values: [5000, 8000] },
  { label: '초등학교 이상 학생 방학', values: [6000, 10000] },
];

export const otherExtraFeeList = [
  { label: '남편 재택근무 및 성인가족 추가', values: [5000, 6000] },
  { label: '시간연장 (시간당)', values: [20000, 20000] },
  { label: '명절 휴일 추가', values: [100000, 100000] },
  { label: '관리사 지정 추가', values: [10000, 10000] },
  { label: '쌍둥이 케어', values: [50000, 60000] },
];
