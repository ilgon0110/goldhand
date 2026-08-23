import { afterEach, describe, expect, it, vi } from 'vitest';

import { verifyPhoneIdToken } from '@/src/shared/lib/verifyPhoneIdToken';

const verifyIdTokenMock = vi.fn();

vi.mock('firebase-admin/auth', () => ({
  getAuth: () => ({ verifyIdToken: verifyIdTokenMock }),
}));

vi.mock('@/src/shared/config/firebase-admin', () => ({
  firebaseAdminApp: {},
}));

describe('verifyPhoneIdToken', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('phone_number 클레임이 있는 유효한 토큰이면 전화번호를 반환한다', async () => {
    verifyIdTokenMock.mockResolvedValueOnce({ phone_number: '+821012345678' });

    const result = await verifyPhoneIdToken('valid-token');

    expect(result).toEqual({ ok: true, phoneNumber: '+821012345678' });
  });

  it('phone_number 클레임이 없으면 no_phone_claim을 반환한다', async () => {
    verifyIdTokenMock.mockResolvedValueOnce({ uid: 'some-uid' });

    const result = await verifyPhoneIdToken('valid-token-without-phone');

    expect(result).toEqual({ ok: false, reason: 'no_phone_claim' });
  });

  it('토큰이 만료되었으면 expired를 반환한다', async () => {
    verifyIdTokenMock.mockRejectedValueOnce({ code: 'auth/id-token-expired' });

    const result = await verifyPhoneIdToken('expired-token');

    expect(result).toEqual({ ok: false, reason: 'expired' });
  });

  it('그 외 검증 실패는 invalid를 반환한다', async () => {
    verifyIdTokenMock.mockRejectedValueOnce({ code: 'auth/argument-error' });

    const result = await verifyPhoneIdToken('bad-token');

    expect(result).toEqual({ ok: false, reason: 'invalid' });
  });
});
