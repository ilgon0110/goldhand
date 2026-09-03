import { beforeEach, describe, expect, it, vi } from 'vitest';

const { adminSet, webSetDoc, cookieGet, verifyIdToken, userGet } = vi.hoisted(() => ({
  adminSet: vi.fn(),
  webSetDoc: vi.fn(),
  cookieGet: vi.fn(),
  verifyIdToken: vi.fn(),
  userGet: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({ get: cookieGet }),
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('firebase-admin/auth', () => ({
  getAuth: vi.fn(() => ({ verifyIdToken })),
}));

vi.mock('firebase-admin/firestore', () => ({
  getFirestore: vi.fn(() => ({
    collection: vi.fn((collectionName: string) => ({
      where: vi.fn(() => ({
        where: vi.fn(() => ({
          where: vi.fn(() => ({
            limit: vi.fn(() => ({
              get: vi.fn().mockResolvedValue({ empty: true }),
            })),
          })),
        })),
      })),
      doc: vi.fn(() => ({
        set: adminSet,
        ...(collectionName === 'users' ? { get: userGet } : {}),
      })),
    })),
  })),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({ empty: true }),
  getFirestore: vi.fn(),
  limit: vi.fn(),
  query: vi.fn(),
  setDoc: webSetDoc,
  where: vi.fn(),
}));

vi.mock('@/src/shared/config/firebase', () => ({ firebaseApp: {} }));
vi.mock('@/src/shared/config/firebase-admin', () => ({ firebaseAdminApp: {} }));

vi.mock('@/src/shared/lib/verifyPhoneIdToken', () => ({
  verifyPhoneIdToken: vi.fn().mockResolvedValue({ ok: true, phoneNumber: '01012345678' }),
}));

vi.mock('@/src/shared/lib/hashPhoneNumber', () => ({
  hashPhoneNumber: vi.fn().mockReturnValue('phone-hash'),
}));

vi.mock('@/src/shared/lib/applyReviewImageSrcs', () => ({
  applyReviewImageSrcs: vi.fn().mockReturnValue({ imageSrcAppliedHtmlString: '<p>후기</p>', thumbnailUrl: null }),
}));

import { POST } from '@/app/api/review/create/route';

describe('POST /api/review/create', () => {
  beforeEach(() => {
    adminSet.mockReset().mockResolvedValue(undefined);
    webSetDoc.mockReset().mockRejectedValue(new Error('permission-denied'));
    cookieGet.mockReset().mockReturnValue(undefined);
    verifyIdToken.mockReset().mockResolvedValue({ uid: 'member-uid' });
    userGet.mockReset().mockResolvedValue({ data: () => ({ isDeleted: false, phoneNumber: '01099998888' }) });
  });

  it('전화 인증을 완료한 비회원 후기를 Admin Firestore로 저장한다', async () => {
    const request = new Request('http://localhost/api/review/create', {
      method: 'POST',
      body: JSON.stringify({
        title: '제목',
        name: '작성자',
        franchisee: '수원점',
        htmlString: '<p>후기</p>',
        docId: 'review-id',
        images: null,
        phoneIdToken: 'verified-token',
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({
      response: 'ok',
      message: '리뷰가 성공적으로 작성되었습니다.',
      docId: 'review-id',
    });
  });

  it('회원 후기는 계정에 등록된 phoneNumber를 저장한다', async () => {
    cookieGet.mockReturnValue({ value: 'member-token' });

    const request = new Request('http://localhost/api/review/create', {
      method: 'POST',
      body: JSON.stringify({
        title: '제목',
        name: '작성자',
        franchisee: '수원점',
        htmlString: '<p>후기</p>',
        docId: 'member-review-id',
        images: null,
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(adminSet).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'member-uid',
        phoneNumber: '01099998888',
      }),
    );
  });

  it.each(['', null])('회원의 phoneNumber가 %j여도 빈 문자열로 저장하고 후기 작성을 허용한다', async phoneNumber => {
    cookieGet.mockReturnValue({ value: 'member-token' });
    userGet.mockResolvedValue({ data: () => ({ isDeleted: false, phoneNumber }) });

    const request = new Request('http://localhost/api/review/create', {
      method: 'POST',
      body: JSON.stringify({
        title: '제목',
        name: '작성자',
        franchisee: '수원점',
        htmlString: '<p>후기</p>',
        docId: 'member-review-id',
        images: null,
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(adminSet).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'member-uid',
        phoneNumber: '',
      }),
    );
  });
});
