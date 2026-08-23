import { Timestamp } from 'firebase/firestore';
import type { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GET } from '@/app/api/review/route';
import type { IReviewDetailData, TAliasAny } from '@/src/shared/types';

const { getPinnedFirstListClientMock, checkAdminAuthMock } = vi.hoisted(() => ({
  getPinnedFirstListClientMock: vi.fn(),
  checkAdminAuthMock: vi.fn(),
}));

vi.mock('@/src/shared/lib/pin/getPinnedFirstList', () => ({
  getPinnedFirstListClient: getPinnedFirstListClientMock,
}));

vi.mock('@/src/shared/lib/checkAdminAuth', () => ({
  checkAdminAuth: checkAdminAuthMock,
}));

// getAdminUserIdSet가 사용하는 users 컬렉션 조회 - 항상 admin 없음으로 처리
vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual<TAliasAny>('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    collection: vi.fn(() => ({})),
    query: vi.fn(),
    where: vi.fn(),
    documentId: vi.fn(),
    getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  };
});

vi.mock('@/src/shared/config/firebase', () => ({
  firebaseApp: {},
}));

const guestReview: IReviewDetailData & { id: string } = {
  id: 'doc-1',
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

function makeRequest(): NextRequest {
  return { nextUrl: new URL('http://localhost/api/review?page=1&franchisee=전체') } as unknown as NextRequest;
}

describe('GET /api/review - PII 마스킹', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('일반 사용자(비관리자)에게는 목록의 phoneNumber/phoneHash가 노출되지 않는다', async () => {
    getPinnedFirstListClientMock.mockResolvedValueOnce({ pinnedItems: [], pageItems: [guestReview], totalDataLength: 1 });
    checkAdminAuthMock.mockResolvedValueOnce({ ok: false, reason: 'no_token' });

    const response = await GET(makeRequest());
    const body = await response.json();

    expect(body.reviewData[0].phoneNumber).toBeNull();
    expect(body.reviewData[0].phoneHash).toBeNull();
  });

  it('관리자에게는 목록의 phoneNumber가 노출되지만 phoneHash는 노출되지 않는다', async () => {
    getPinnedFirstListClientMock.mockResolvedValueOnce({ pinnedItems: [], pageItems: [guestReview], totalDataLength: 1 });
    checkAdminAuthMock.mockResolvedValueOnce({ ok: true, uid: 'admin-uid', isAdmin: true });

    const response = await GET(makeRequest());
    const body = await response.json();

    expect(body.reviewData[0].phoneNumber).toBe('+821012345678');
    expect(body.reviewData[0].phoneHash).toBeNull();
  });
});
