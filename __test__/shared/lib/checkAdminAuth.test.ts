import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const verifySessionCookie = vi.hoisted(() => vi.fn());
const userDocumentGet = vi.hoisted(() => vi.fn());
const cookieGet = vi.hoisted(() => vi.fn());

// checkAdminAuth의 1년 컷오프 판정이 실행 시점과 무관하게 항상 같은 결과를 내도록 시각을 고정한다.
const FIXED_NOW = new Date('2026-01-01T00:00:00Z');

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ get: cookieGet })),
}));
vi.mock('@/src/shared/lib/server/sessionCookie', () => ({
  verifySessionCookie,
}));
vi.mock('firebase-admin/firestore', () => ({
  getFirestore: vi.fn(() => ({
    collection: vi.fn(() => ({
      doc: vi.fn(() => ({ get: userDocumentGet })),
    })),
  })),
}));
vi.mock('@/src/shared/config/firebase-admin', () => ({ firebaseAdminApp: {} }));

import { checkAdminAuth } from '@/src/shared/lib/server';

describe('checkAdminAuth', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_NOW);
    cookieGet.mockReturnValue({ value: 'secret-session-cookie' });
    verifySessionCookie.mockResolvedValue({ uid: 'user-uid' });
    userDocumentGet.mockResolvedValue({
      exists: true,
      data: () => ({ grade: 'basic', isDeleted: false }),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('세션 쿠키가 없으면 no_token을 반환한다', async () => {
    cookieGet.mockReturnValue(undefined);

    const result = await checkAdminAuth();

    expect(result).toEqual({ ok: false, reason: 'no_token' });
    expect(verifySessionCookie).not.toHaveBeenCalled();
  });

  it('세션 쿠키가 만료되었으면 expired를 반환한다', async () => {
    verifySessionCookie.mockRejectedValue({ code: 'auth/session-cookie-expired' });

    const result = await checkAdminAuth();

    expect(result).toEqual({ ok: false, reason: 'expired' });
  });

  it('만료 외의 검증 실패는 invalid를 반환한다', async () => {
    verifySessionCookie.mockRejectedValue({ code: 'auth/argument-error' });

    const result = await checkAdminAuth();

    expect(result).toEqual({ ok: false, reason: 'invalid' });
  });

  it('유저 문서가 존재하지 않으면 not_found를 반환한다', async () => {
    userDocumentGet.mockResolvedValue({ exists: false, data: () => undefined });

    const result = await checkAdminAuth();

    expect(result).toEqual({ ok: false, reason: 'not_found' });
  });

  it('1년 이내에 탈퇴한 유저는 deleted_rejoin을 반환한다', async () => {
    const sixMonthsAgoSeconds = Math.floor((FIXED_NOW.getTime() - 180 * 24 * 60 * 60 * 1000) / 1000);
    userDocumentGet.mockResolvedValue({
      exists: true,
      data: () => ({ isDeleted: true, deletedAt: { seconds: sixMonthsAgoSeconds } }),
    });

    const result = await checkAdminAuth();

    expect(result).toEqual({ ok: false, reason: 'deleted_rejoin' });
  });

  it('1년보다 오래 전에 탈퇴한 유저는 deleted를 반환한다', async () => {
    const twoYearsAgoSeconds = Math.floor((FIXED_NOW.getTime() - 730 * 24 * 60 * 60 * 1000) / 1000);
    userDocumentGet.mockResolvedValue({
      exists: true,
      data: () => ({ isDeleted: true, deletedAt: { seconds: twoYearsAgoSeconds } }),
    });

    const result = await checkAdminAuth();

    expect(result).toEqual({ ok: false, reason: 'deleted' });
  });

  it('grade가 admin이면 isAdmin:true로 검증에 성공한다', async () => {
    userDocumentGet.mockResolvedValue({ exists: true, data: () => ({ grade: 'admin', isDeleted: false }) });

    const result = await checkAdminAuth();

    expect(result).toEqual({ ok: true, uid: 'user-uid', isAdmin: true });
    expect(verifySessionCookie).toHaveBeenNthCalledWith(1, 'secret-session-cookie', false);
    expect(verifySessionCookie).toHaveBeenNthCalledWith(2, 'secret-session-cookie', true);
  });

  it('grade가 admin이 아니면 isAdmin:false로 검증에 성공한다', async () => {
    const result = await checkAdminAuth();

    expect(result).toEqual({ ok: true, uid: 'user-uid', isAdmin: false });
    expect(verifySessionCookie).toHaveBeenCalledOnce();
    expect(verifySessionCookie).toHaveBeenCalledWith('secret-session-cookie', false);
  });

  it('관리자 전용 요청은 최초 검증부터 폐기 상태를 확인한다', async () => {
    userDocumentGet.mockResolvedValue({ exists: true, data: () => ({ grade: 'admin', isDeleted: false }) });

    const result = await checkAdminAuth(true);

    expect(result).toEqual({ ok: true, uid: 'user-uid', isAdmin: true });
    expect(verifySessionCookie).toHaveBeenCalledOnce();
    expect(verifySessionCookie).toHaveBeenCalledWith('secret-session-cookie', true);
  });

  it.each([
    ['폐기된 관리자 세션', 'auth/session-cookie-revoked'],
    ['비활성 관리자', 'auth/user-disabled'],
  ])('%s에는 관리자 권한을 부여하지 않는다', async (_description, code) => {
    userDocumentGet.mockResolvedValue({ exists: true, data: () => ({ grade: 'admin', isDeleted: false }) });
    verifySessionCookie.mockResolvedValueOnce({ uid: 'user-uid' }).mockRejectedValueOnce({ code });

    const result = await checkAdminAuth();

    expect(result).toEqual({ ok: false, reason: 'invalid' });
  });
});
