import { Timestamp } from 'firebase/firestore';
import type { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { POST } from '@/app/api/review/update/route';
import type { IReviewDetailData, TAliasAny } from '@/src/shared/types';

const { getDocMock, updateDocMock, verifyIdTokenMock } = vi.hoisted(() => ({
  getDocMock: vi.fn(),
  updateDocMock: vi.fn(() => Promise.resolve()),
  verifyIdTokenMock: vi.fn(),
}));

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual<TAliasAny>('firebase/firestore');
  return {
    ...actual,
    getFirestore: vi.fn(() => ({})),
    doc: vi.fn(() => ({})),
    getDoc: getDocMock,
    updateDoc: updateDocMock,
  };
});

vi.mock('firebase-admin/auth', () => ({
  getAuth: () => ({ verifyIdToken: verifyIdTokenMock }),
}));

vi.mock('@/src/shared/config/firebase', () => ({
  firebaseApp: {},
}));

vi.mock('@/src/shared/config/firebase-admin', () => ({
  firebaseAdminApp: {},
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

const cookieGetMock = vi.fn();
vi.mock('next/headers', () => ({
  cookies: () => ({ get: cookieGetMock }),
}));

const existingReview: IReviewDetailData = {
  thumbnail: 'https://firebasestorage.googleapis.com/existing-thumbnail.png',
  htmlString: '<p>기존 내용</p>',
  createdAt: Timestamp.now(),
  franchisee: '전체',
  isPinned: false,
  pinnedAt: null,
  name: '홍길동',
  title: '기존 제목',
  updatedAt: Timestamp.now(),
  userId: 'member-uid',
  comments: null,
};

function makeRequest(body: Record<string, unknown>): NextRequest {
  return { json: () => Promise.resolve(body) } as unknown as NextRequest;
}

describe('POST /api/review/update - 썸네일 보존', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('새 이미지 없이 수정하면 기존 썸네일이 null로 초기화되지 않고 유지된다', async () => {
    getDocMock.mockResolvedValueOnce({ exists: () => true, data: () => existingReview });
    cookieGetMock.mockReturnValue({ value: 'valid-token' });
    verifyIdTokenMock.mockResolvedValueOnce({ uid: 'member-uid' });
    // 탈퇴 여부 확인을 위한 users 문서 조회
    getDocMock.mockResolvedValueOnce({ exists: () => true, data: () => ({ isDeleted: false }) });

    const request = makeRequest({
      docId: 'doc-1',
      title: '수정된 제목',
      name: '홍길동',
      franchisee: '전체',
      htmlString: '<p>수정된 내용</p>',
      images: null,
    });

    const response = await POST(request);
    const body = await response.json();

    expect(body.response).toBe('ok');
    expect(updateDocMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ thumbnail: existingReview.thumbnail }),
    );
  });

  it('새 썸네일 이미지가 있으면 새 URL로 교체된다', async () => {
    getDocMock.mockResolvedValueOnce({ exists: () => true, data: () => existingReview });
    cookieGetMock.mockReturnValue({ value: 'valid-token' });
    verifyIdTokenMock.mockResolvedValueOnce({ uid: 'member-uid' });
    getDocMock.mockResolvedValueOnce({ exists: () => true, data: () => ({ isDeleted: false }) });

    const request = makeRequest({
      docId: 'doc-1',
      title: '수정된 제목',
      name: '홍길동',
      franchisee: '전체',
      htmlString: '<p>수정된 내용</p>',
      images: [{ key: 'thumbnail', url: 'https://firebasestorage.googleapis.com/new-thumbnail.png' }],
    });

    const response = await POST(request);
    const body = await response.json();

    expect(body.response).toBe('ok');
    expect(updateDocMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ thumbnail: 'https://firebasestorage.googleapis.com/new-thumbnail.png' }),
    );
  });
});
