import { Timestamp } from 'firebase/firestore';
import type { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GET } from '@/app/api/review/detail/route';
import type { IReviewDetailData, TAliasAny } from '@/src/shared/types';

const { getDocMock, getDocsMock, checkAdminAuthMock } = vi.hoisted(() => ({
  getDocMock: vi.fn(),
  getDocsMock: vi.fn(() => Promise.resolve({ docs: [] })),
  checkAdminAuthMock: vi.fn(),
}));

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual<TAliasAny>('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    doc: vi.fn(() => ({})),
    getDoc: getDocMock,
    collection: vi.fn(() => ({})),
    getDocs: getDocsMock,
    orderBy: vi.fn(),
    query: vi.fn(),
  };
});

vi.mock('@/src/shared/config/firebase', () => ({
  firebaseApp: {},
}));

vi.mock('@/src/shared/lib/checkAdminAuth', () => ({
  checkAdminAuth: checkAdminAuthMock,
}));

const reviewDoc: IReviewDetailData = {
  thumbnail: null,
  htmlString: '<p>내용</p>',
  createdAt: Timestamp.now(),
  franchisee: '전체',
  isPinned: false,
  pinnedAt: null,
  name: '홍길동',
  title: '후기 제목',
  updatedAt: Timestamp.now(),
  userId: null,
  phoneNumber: '+821012345678',
  phoneHash: 'deadbeef',
  comments: null,
};

function makeRequest(docId: string): NextRequest {
  return { nextUrl: new URL(`http://localhost/api/review/detail?docId=${docId}`) } as unknown as NextRequest;
}

describe('GET /api/review/detail - PII 마스킹', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('일반 사용자(비관리자)에게는 phoneNumber/phoneHash가 노출되지 않는다', async () => {
    getDocMock.mockResolvedValueOnce({ exists: () => true, data: () => reviewDoc });
    checkAdminAuthMock.mockResolvedValueOnce({ ok: false, reason: 'no_token' });

    const response = await GET(makeRequest('doc-1'));
    const body = await response.json();

    expect(body.data.phoneNumber).toBeNull();
    expect(body.data.phoneHash).toBeNull();
  });

  it('관리자에게는 phoneNumber가 노출되지만 phoneHash는 노출되지 않는다', async () => {
    getDocMock.mockResolvedValueOnce({ exists: () => true, data: () => reviewDoc });
    checkAdminAuthMock.mockResolvedValueOnce({ ok: true, uid: 'admin-uid', isAdmin: true });

    const response = await GET(makeRequest('doc-1'));
    const body = await response.json();

    expect(body.data.phoneNumber).toBe('+821012345678');
    expect(body.data.phoneHash).toBeNull();
  });

  it('로그인은 했지만 관리자가 아니면 phoneNumber가 노출되지 않는다', async () => {
    getDocMock.mockResolvedValueOnce({ exists: () => true, data: () => reviewDoc });
    checkAdminAuthMock.mockResolvedValueOnce({ ok: true, uid: 'basic-uid', isAdmin: false });

    const response = await GET(makeRequest('doc-1'));
    const body = await response.json();

    expect(body.data.phoneNumber).toBeNull();
  });
});
