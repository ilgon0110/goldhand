import { describe, expect, it } from 'vitest';

import { isSafeReservationRedirectPath } from '@/src/shared/lib/isSafeReservationRedirectPath';

describe('isSafeReservationRedirectPath', () => {
  it('예약 상세 경로는 허용한다', () => {
    expect(isSafeReservationRedirectPath('/reservation/list/abc123')).toBe(true);
    expect(isSafeReservationRedirectPath('/reservation/list/A_b-C')).toBe(true);
  });

  it('값이 비어 있으면 거부한다', () => {
    expect(isSafeReservationRedirectPath(null)).toBe(false);
    expect(isSafeReservationRedirectPath(undefined)).toBe(false);
    expect(isSafeReservationRedirectPath('')).toBe(false);
  });

  it('외부 주소로 나가는 값은 거부한다', () => {
    expect(isSafeReservationRedirectPath('//evil.com')).toBe(false);
    expect(isSafeReservationRedirectPath('https://evil.com')).toBe(false);
    expect(isSafeReservationRedirectPath('javascript:alert(1)')).toBe(false);
  });

  it('경로 탈출 시도는 거부한다', () => {
    expect(isSafeReservationRedirectPath('/reservation/list/../../manager')).toBe(false);
  });

  it('개행이 섞인 값은 거부한다', () => {
    expect(isSafeReservationRedirectPath('/reservation/list/abc123\n')).toBe(false);
    expect(isSafeReservationRedirectPath('/reservation/list/abc\n123')).toBe(false);
  });

  it('쿼리스트링이나 해시가 붙은 값은 거부한다', () => {
    expect(isSafeReservationRedirectPath('/reservation/list/abc123?foo=bar')).toBe(false);
    expect(isSafeReservationRedirectPath('/reservation/list/abc123#hash')).toBe(false);
  });
});
