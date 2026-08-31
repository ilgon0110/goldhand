import { Timestamp } from 'firebase/firestore';
import type { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GET } from '@/app/api/review/route';
import type { IReviewDetailData } from '@/src/shared/types';

const { getPinnedFirstListAdminMock, checkAdminAuthMock, usersWhereGetMock } = vi.hoisted(() => ({
  getPinnedFirstListAdminMock: vi.fn(),
  checkAdminAuthMock: vi.fn(),
  usersWhereGetMock: vi.fn(() => Promise.resolve({ docs: [] })),
}));

vi.mock('@/src/shared/lib/pin/getPinnedFirstList', () => ({
  getPinnedFirstListAdmin: getPinnedFirstListAdminMock,
}));

vi.mock('@/src/shared/lib/checkAdminAuth', () => ({
  checkAdminAuth: checkAdminAuthMock,
}));

// getAdminUserIdSet가 실제로 사용하는 Admin SDK 경로 - users 컬렉션 조회를 mock 처리
vi.mock('firebase-admin/firestore', () => ({
  FieldPath: { documentId: vi.fn() },
  getFirestore: vi.fn(() => ({
    collection: vi.fn(() => ({
      where: vi.fn(() => ({
        get: usersWhereGetMock,
      })),
    })),
  })),
}));

vi.mock('@/src/shared/config/firebase-admin', () => ({
  firebaseAdminApp: {},
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
    getPinnedFirstListAdminMock.mockResolvedValueOnce({ pinnedItems: [], pageItems: [guestReview], totalDataLength: 1 });
    checkAdminAuthMock.mockResolvedValueOnce({ ok: false, reason: 'no_token' });

    const response = await GET(makeRequest());
    const body = await response.json();

    expect(body.reviewData[0].phoneNumber).toBeNull();
    expect(body.reviewData[0].phoneHash).toBeNull();
  });

  it('관리자에게는 목록의 phoneNumber가 노출되지만 phoneHash는 노출되지 않는다', async () => {
    getPinnedFirstListAdminMock.mockResolvedValueOnce({ pinnedItems: [], pageItems: [guestReview], totalDataLength: 1 });
    checkAdminAuthMock.mockResolvedValueOnce({ ok: true, uid: 'admin-uid', isAdmin: true });

    const response = await GET(makeRequest());
    const body = await response.json();

    expect(body.reviewData[0].phoneNumber).toBe('+821012345678');
    expect(body.reviewData[0].phoneHash).toBeNull();
  });
});
