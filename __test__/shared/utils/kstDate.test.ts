import {
  formatDateToHMS,
  formatDateToYMD,
  formatKstYMD,
  getRelativeTimeFromTimestamp,
} from '@/src/shared/utils/index';

// 실행 환경 TZ와 무관하게 KST로 나와야 한다(#117). TZ=UTC / Asia/Seoul / America/Los_Angeles 모두에서 통과해야 한다.
const ts = (iso: string) => ({ seconds: Date.parse(iso) / 1000, nanoseconds: 0 });

describe('KST 날짜 포맷 (#117)', () => {
  afterEach(() => vi.useRealTimers());

  it('UTC 15시 이후(KST 다음날 0시 이후) timestamp를 KST 날짜로 포맷한다', () => {
    expect(formatDateToYMD(ts('2026-11-11T15:30:00Z'))).toBe('2026-11-12');
    expect(formatDateToYMD(ts('2026-11-11T14:59:59Z'))).toBe('2026-11-11');
    expect(formatDateToYMD(null)).toBe('');
  });

  it('KST 자정은 00시로 포맷한다(24시 아님)', () => {
    expect(formatDateToHMS(ts('2026-11-11T15:00:05Z'))).toBe('00:00:05');
  });

  it('date picker가 보낸 KST 자정 ISO 문자열을 KST 날짜로 포맷한다', () => {
    expect(formatKstYMD('2026-11-11T15:00:00.000Z')).toBe('2026-11-12');
    expect(formatKstYMD('2026-11-12')).toBe('2026-11-12');
  });

  it('상대 시간은 KST 달력 날짜 기준으로 계산한다', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-11-12T00:10:00Z')); // KST 11-12 09:10

    expect(getRelativeTimeFromTimestamp(ts('2026-11-11T15:00:00Z'))).toBe('오늘'); // KST 11-12 00:00
    expect(getRelativeTimeFromTimestamp(ts('2026-11-11T14:59:00Z'))).toBe('어제'); // KST 11-11 23:59
    expect(getRelativeTimeFromTimestamp(ts('2026-11-09T15:00:00Z'))).toBe('2일 전');
  });
});
