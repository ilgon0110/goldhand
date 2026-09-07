import { Timestamp } from 'firebase/firestore';
import type { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { POST } from '@/app/api/review/update/route';
import type { IReviewDetailData } from '@/src/shared/types';

const { getDocMock, updateDocMock, checkAdminAuthMock } = vi.hoisted(() => ({
  getDocMock: vi.fn(),
  updateDocMock: vi.fn(() => Promise.resolve()),
  checkAdminAuthMock: vi.fn(),
}));

vi.mock('firebase-admin/firestore', () => ({
  getFirestore: vi.fn(() => ({
    collection: vi.fn(() => ({
      doc: vi.fn(() => ({
        get: getDocMock,
        update: updateDocMock,
      })),
    })),
  })),
}));

vi.mock('@/src/shared/config/firebase-admin', () => ({
  firebaseAdminApp: {},
}));

vi.mock('@/src/shared/lib/checkAdminAuth', () => ({
  checkAdminAuth: checkAdminAuthMock,
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const existingReview: IReviewDetailData = {
  thumbnail: 'https://firebasestorage.googleapis.com/old-thumb.webp',
  htmlString: '<p>기존 내용</p>',
  createdAt: Timestamp.now(),
  franchisee: '전체',
  isPinned: false,
  pinnedAt: null,
  name: '홍길동',
  title: '기존 제목',
  updatedAt: Timestamp.now(),
  userId: 'author-uid',
  phoneNumber: null,
  phoneHash: null,
  comments: null,
};

function makeRequest(body: unknown): NextRequest {
  return { json: () => Promise.resolve(body) } as unknown as NextRequest;
}

describe('POST /api/review/update - 썸네일 보존', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('이미지를 건드리지 않은 수정(images: null)에서는 기존 썸네일을 유지한다', async () => {
    getDocMock.mockResolvedValueOnce({ exists: true, data: () => existingReview });
    checkAdminAuthMock.mockResolvedValueOnce({ ok: true, uid: 'author-uid', isAdmin: false });

    await POST(
      makeRequest({
        docId: 'doc-1',
        title: '수정된 제목',
        name: existingReview.name,
        franchisee: existingReview.franchisee,
        htmlString: '<p>수정된 내용</p>',
        images: null,
      }),
    );

    expect(updateDocMock).toHaveBeenCalledWith(expect.objectContaining({ thumbnail: existingReview.thumbnail }));
  });

  it('새 썸네일이 업로드되면 그 값으로 교체한다', async () => {
    getDocMock.mockResolvedValueOnce({ exists: true, data: () => existingReview });
    checkAdminAuthMock.mockResolvedValueOnce({ ok: true, uid: 'author-uid', isAdmin: false });

    await POST(
      makeRequest({
        docId: 'doc-1',
        title: existingReview.title,
        name: existingReview.name,
        franchisee: existingReview.franchisee,
        htmlString: '<p>수정된 내용</p>',
        images: [{ key: 'thumbnail', url: 'https://firebasestorage.googleapis.com/new-thumb.webp' }],
      }),
    );

    expect(updateDocMock).toHaveBeenCalledWith(
      expect.objectContaining({ thumbnail: 'https://firebasestorage.googleapis.com/new-thumb.webp' }),
    );
  });
});
