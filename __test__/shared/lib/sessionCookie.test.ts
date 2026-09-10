import { afterEach, describe, expect, it, vi } from 'vitest';

const verifySessionCookieMock = vi.fn();

vi.mock('firebase-admin/auth', () => ({
  getAuth: () => ({ verifySessionCookie: verifySessionCookieMock }),
}));

vi.mock('@/src/shared/config/firebase-admin', () => ({
  firebaseAdminApp: {},
}));

import { verifySessionCookie } from '@/src/shared/lib/server/sessionCookie';

describe('verifySessionCookie', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('일반 세션 쿠키는 추가 폐기 검사 없이 검증한다', async () => {
    verifySessionCookieMock.mockResolvedValueOnce({ uid: 'user-uid' });

    await expect(verifySessionCookie('session-cookie')).resolves.toEqual({ uid: 'user-uid' });
    expect(verifySessionCookieMock).toHaveBeenCalledWith('session-cookie', false);
  });

  it('관리자 세션 쿠키는 폐기 및 사용자 비활성화 상태를 확인한다', async () => {
    verifySessionCookieMock.mockResolvedValueOnce({ uid: 'admin-uid' });

    await expect(verifySessionCookie('session-cookie', true)).resolves.toEqual({ uid: 'admin-uid' });
    expect(verifySessionCookieMock).toHaveBeenCalledWith('session-cookie', true);
  });

  it.each([
    ['폐기된 세션', 'auth/session-cookie-revoked'],
    ['비활성 사용자', 'auth/user-disabled'],
  ])('%s 오류를 호출자에게 전달한다', async (_description, code) => {
    const firebaseError = { code };
    verifySessionCookieMock.mockRejectedValueOnce(firebaseError);

    await expect(verifySessionCookie('invalid-session-cookie', true)).rejects.toBe(firebaseError);
  });
});
