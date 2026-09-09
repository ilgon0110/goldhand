import { beforeEach, describe, expect, it, vi } from 'vitest';

const verifySessionCookie = vi.hoisted(() => vi.fn());
const getUser = vi.hoisted(() => vi.fn());
const userDocumentGet = vi.hoisted(() => vi.fn());
const cookieGet = vi.hoisted(() => vi.fn());

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ get: cookieGet })),
}));
vi.mock('firebase-admin/auth', () => ({
  getAuth: vi.fn(() => ({ getUser, verifySessionCookie })),
}));
vi.mock('firebase-admin/firestore', () => ({
  getFirestore: vi.fn(() => ({
    collection: vi.fn(() => ({
      doc: vi.fn(() => ({ get: userDocumentGet })),
    })),
  })),
}));
vi.mock('@/src/shared/config/firebase-admin', () => ({ firebaseAdminApp: {} }));

import { GET } from '@/app/api/user/route';

describe('GET /api/user security response', () => {
  beforeEach(() => {
    cookieGet.mockReturnValue({ value: 'secret-session-cookie' });
    verifySessionCookie.mockResolvedValue({ uid: 'verified-user' });
    getUser.mockResolvedValue({ providerData: [{ providerId: 'password' }, { providerId: 'phone' }] });
    userDocumentGet.mockResolvedValue({
      exists: true,
      data: () => ({ email: 'user@example.com', grade: 'basic', isDeleted: false }),
    });
  });

  it('marks the user response private and non-cacheable', async () => {
    const response = await GET();

    expect(response.headers.get('cache-control')).toBe('private, no-store');
  });

  it('세션 쿠키가 없으면 401이 아닌 200 + userData:null로 응답한다 (게스트 접근 경로를 깨지 않기 위한 회귀 방지)', async () => {
    cookieGet.mockReturnValue(undefined);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.response).toBe('ng');
    expect(body.userData).toBeNull();
    expect(verifySessionCookie).not.toHaveBeenCalled();
  });

  it('세션 검증은 성공했지만 그 이후 DB 조회에서 진짜 장애가 나면 500을 반환한다', async () => {
    userDocumentGet.mockRejectedValue({ code: 'unavailable' });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.response).toBe('ng');
  });

  it('세션은 유효했지만 Firebase Auth 유저 레코드가 이미 삭제된 경우는 500이 아닌 200으로 처리한다', async () => {
    getUser.mockRejectedValue({ code: 'auth/user-not-found' });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.response).toBe('ng');
    expect(body.userData).toBeNull();
  });
});
