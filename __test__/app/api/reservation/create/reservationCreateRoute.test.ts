import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '@/src/__mock__/node';

const { consultSet, usersGet } = vi.hoisted(() => ({
  consultSet: vi.fn(),
  usersGet: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn().mockReturnValue({ value: 'valid-access-token' }),
  }),
}));

vi.mock('firebase-admin/auth', () => ({
  getAuth: vi.fn(() => ({
    verifyIdToken: vi.fn().mockResolvedValue({ uid: 'member-uid' }),
  })),
}));

vi.mock('firebase-admin/firestore', () => ({
  getFirestore: vi.fn(() => ({
    collection: vi.fn((name: string) => {
      if (name === 'users') {
        return { doc: vi.fn(() => ({ get: usersGet })) };
      }
      return { doc: vi.fn(() => ({ set: consultSet })) };
    }),
  })),
}));

vi.mock('@/src/shared/config/firebase-admin', () => ({ firebaseAdminApp: {} }));

import { POST } from '@/app/api/reservation/create/route';

describe('POST /api/reservation/create - 회원', () => {
  beforeEach(() => {
    consultSet.mockReset().mockResolvedValue(undefined);
    usersGet.mockReset().mockResolvedValue({
      data: () => ({ isDeleted: false, phoneNumber: '01099998888' }),
    });
    server.use(
      http.post('https://www.google.com/recaptcha/api/siteverify', () =>
        HttpResponse.json({ success: true, score: 0.9 }),
      ),
    );
  });

  it('폼에 계정과 다른 phoneNumber를 입력해도 계정에 등록된 번호로 저장된다', async () => {
    const request = new Request('http://localhost/api/reservation/create', {
      method: 'POST',
      body: JSON.stringify({
        title: '상담 제목',
        name: '홍길동',
        userId: 'member-uid',
        franchisee: '수원점',
        phoneNumber: '01011112222',
        location: '서울시 강남구',
        content: '상담 내용',
        recaptchaToken: 'token',
      }),
    });

    const response = (await POST(request)) as Response;
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.response).toBe('ok');
    expect(consultSet).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'member-uid',
        phoneNumber: '01099998888',
      }),
    );
  });

  it('계정에 phoneNumber가 없으면 상담 신청을 막고 안내 메시지를 반환한다', async () => {
    usersGet.mockResolvedValue({ data: () => ({ isDeleted: false, phoneNumber: '' }) });

    const request = new Request('http://localhost/api/reservation/create', {
      method: 'POST',
      body: JSON.stringify({
        title: '상담 제목',
        name: '홍길동',
        userId: 'member-uid',
        franchisee: '수원점',
        phoneNumber: '01011112222',
        location: '서울시 강남구',
        content: '상담 내용',
        recaptchaToken: 'token',
      }),
    });

    const response = (await POST(request)) as Response;
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.response).toBe('ng');
    expect(consultSet).not.toHaveBeenCalled();
  });
});
