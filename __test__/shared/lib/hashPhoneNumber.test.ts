import { afterEach, describe, expect, it, vi } from 'vitest';

import { hashPhoneNumber } from '@/src/shared/lib/hashPhoneNumber';

describe('hashPhoneNumber', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('같은 전화번호는 항상 같은 해시를 반환한다', () => {
    vi.stubEnv('PHONE_HASH_SECRET', 'test-secret');

    const hash1 = hashPhoneNumber('01012345678');
    const hash2 = hashPhoneNumber('01012345678');

    expect(hash1).toBe(hash2);
  });

  it('구분자가 있어도 정규화되어 동일한 해시를 반환한다', () => {
    vi.stubEnv('PHONE_HASH_SECRET', 'test-secret');

    const withDash = hashPhoneNumber('010-1234-5678');
    const plain = hashPhoneNumber('01012345678');
    const withSpace = hashPhoneNumber('010 1234 5678');

    expect(withDash).toBe(plain);
    expect(withSpace).toBe(plain);
  });

  it('다른 전화번호는 다른 해시를 반환한다', () => {
    vi.stubEnv('PHONE_HASH_SECRET', 'test-secret');

    const hash1 = hashPhoneNumber('01012345678');
    const hash2 = hashPhoneNumber('01087654321');

    expect(hash1).not.toBe(hash2);
  });

  it('PHONE_HASH_SECRET 환경변수가 없으면 명확한 에러를 던진다', () => {
    vi.stubEnv('PHONE_HASH_SECRET', '');

    expect(() => hashPhoneNumber('01012345678')).toThrow('PHONE_HASH_SECRET');
  });
});
