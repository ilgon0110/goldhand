// 요금 금액은 entities/price가 소유한다. 여기는 화면 문구만 둔다.
// 금액이 들어가는 문구(공휴일 추가, 시간연장)는 lib/notes.ts에서 실제 요금으로 만든다.

export const WEEKS = ['1주', '2주', '3주', '4주'];

export const PLAN_LINKS = [
  { id: 'commute', label: '출퇴근형' },
  { id: 'live-in', label: '입주형' },
  { id: 'half-day', label: '오전·오후 돌봄' },
  { id: 'one-day', label: '하루돌봄' },
  { id: 'extra', label: '부가서비스' },
];

export const commuteCheckList = [
  '1주·2주·3주·4주 단위별 금액이 상이합니다.',
  '주 5일 (월~금) 평일 09:00 ~ 18:00 (휴게시간 1시간 포함)',
  '큰아이 추가 및 성인 추가 금액은 별도입니다.',
];

export const inHouseCheckList = [
  '일요일 19시 출근 ~ 금요일 15시 퇴근',
  '주 6일제 이용 시 토요일 15시 퇴근',
  '19시 업무 종료 후 신생아 집중 케어',
  '하루 2시간 휴게시간 포함',
];

export const dayoffCheckList = [
  '평일 09:00 ~ 13:00 / 평일 10:00 ~ 14:00',
  '점심식사 제공',
  '주 5일제 예약만 가능합니다.',
  '큰아이·성인·휴일 추가비는 종일제 기준 50%만 적용됩니다.',
];

export const CHILD_EXTRA_NOTE = '오전·오후 돌봄은 큰아이·성인·휴일 추가비가 종일제 기준 50%만 적용됩니다.';

// 출퇴근형·입주형 금액이 같으면 한 칸으로 합쳐 보여주는 부가 요금 행
export const MERGEABLE_FEE_IDS = ['adult-family', 'overtime'];
