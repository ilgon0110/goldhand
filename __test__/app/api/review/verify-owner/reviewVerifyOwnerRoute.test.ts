import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getReview, hashPhoneNumber, verifyPhoneIdToken } = vi.hoisted(() => ({
  getReview: vi.fn(),
  hashPhoneNumber: vi.fn(),
  verifyPhoneIdToken: vi.fn(),
}));

vi.mock('firebase-admin/firestore', () => ({
  getFirestore: vi.fn(() => ({
    collection: vi.fn(() => ({
      doc: vi.fn(() => ({ get: getReview })),
    })),
  })),
}));

vi.mock('@/src/shared/config/firebase-admin', () => ({ firebaseAdminApp: {} }));
vi.mock('@/src/shared/lib/hashPhoneNumber', () => ({ hashPhoneNumber }));
vi.mock('@/src/shared/lib/verifyPhoneIdToken', () => ({ verifyPhoneIdToken }));

import { POST } from '@/app/api/review/verify-owner/route';

const request = () =>
  new Request('http://localhost/api/review/verify-owner', {
    method: 'POST',
    body: JSON.stringify({ docId: 'review-id', phoneIdToken: 'verified-token' }),
  });

describe('POST /api/review/verify-owner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getReview.mockResolvedValue({ exists: true, data: () => ({ userId: null, phoneHash: 'original-hash' }) });
    verifyPhoneIdToken.mockResolvedValue({ ok: true, phoneNumber: '01012345678' });
  });

  it('인증 번호가 작성 번호와 다르면 원인을 숨긴 일반 오류를 반환한다', async () => {
    hashPhoneNumber.mockReturnValue('different-hash');

    const response = await POST(request());

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      response: 'ng',
      message: '본인 확인에 실패했습니다. 입력 정보를 확인해주세요.',
    });
  });

  it('유효하지 않은 인증 토큰도 번호 불일치와 같은 오류를 반환한다', async () => {
    verifyPhoneIdToken.mockResolvedValue({ ok: false });

    const response = await POST(request());

    expect(response.status).toBe(403);
    expect(await response.json()).toEqual({
      response: 'ng',
      message: '본인 확인에 실패했습니다. 입력 정보를 확인해주세요.',
    });
  });

  it('인증 번호가 작성 번호와 일치하면 본인 확인을 완료한다', async () => {
    hashPhoneNumber.mockReturnValue('original-hash');

    const response = await POST(request());

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ response: 'ok', message: '본인 확인이 완료되었습니다.' });
  });
});
