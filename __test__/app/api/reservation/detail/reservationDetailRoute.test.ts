import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const cookieGet = vi.hoisted(() => vi.fn());
const consultGet = vi.hoisted(() => vi.fn());
const userGet = vi.hoisted(() => vi.fn());
const verifySessionCookie = vi.hoisted(() => vi.fn());
const verifyReservationToken = vi.hoisted(() => vi.fn());

vi.mock('next/headers', () => ({ cookies: () => ({ get: cookieGet }) }));
vi.mock('@/src/shared/lib/server', () => ({ verifySessionCookie }));
vi.mock('jsonwebtoken', () => ({ default: { verify: verifyReservationToken } }));
vi.mock('@/src/shared/config/firebase', () => ({ firebaseApp: {} }));
vi.mock('@/src/shared/config/firebase-admin', () => ({ firebaseAdminApp: {} }));
vi.mock('firebase-admin/firestore', () => ({
  getFirestore: () => ({
    collection: (name: string) => ({
      doc: () => ({ get: name === 'consults' ? consultGet : userGet }),
    }),
  }),
}));
vi.mock('firebase/firestore', () => ({
  Timestamp: { now: () => ({ seconds: 0, nanoseconds: 0 }) },
  collection: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({ docs: [] }),
  getFirestore: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
}));

import { GET } from '@/app/api/reservation/detail/route';

const docId = 'secret-doc';
const timestamp = { seconds: 1, nanoseconds: 0 };

function request() {
  return new NextRequest(`https://nicegoldhand.com/api/reservation/detail?docId=${docId}`);
}

function setCookies(values: { reservationToken?: string; session?: string } = {}) {
  cookieGet.mockImplementation((name: string) => (values[name as keyof typeof values] ? { value: values[name as keyof typeof values] } : undefined));
}

function setConsult(userId: string | null) {
  consultGet.mockResolvedValue({
    exists: true,
    data: () => ({
      bornDate: null,
      content: 'secret content',
      createdAt: timestamp,
      franchisee: '전체',
      isPinned: false,
      pinnedAt: null,
      location: '서울',
      name: '작성자',
      password: 'password-hash',
      phoneNumber: '01012345678',
      secret: true,
      title: '비밀글',
      updatedAt: timestamp,
      userId,
    }),
  });
}

describe('GET /api/reservation/detail secret-post authorization', () => {
  beforeEach(() => {
    cookieGet.mockReset();
    consultGet.mockReset();
    userGet.mockReset();
    verifySessionCookie.mockReset();
    verifyReservationToken.mockReset();
    userGet.mockResolvedValue({ exists: true, data: () => ({ grade: 'basic' }) });
  });

  it('requires a password token for an anonymous secret post', async () => {
    setConsult(null);
    setCookies();

    const response = await GET(request());

    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ response: 'ng', code: 'NEEDS_PASSWORD' });
  });

  it('returns an anonymous secret post without exposing its phone number after password verification', async () => {
    setConsult(null);
    setCookies({ reservationToken: 'valid-token' });
    verifyReservationToken.mockReturnValue({ docId });

    const response = await GET(request());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ response: 'ok', code: 'OK' });
    expect(body.data.password).toBeNull();
    expect(body.data.phoneNumber).toBe('');
  });

  it('requires login for a member secret post without a valid session', async () => {
    setConsult('owner-id');
    setCookies();

    const response = await GET(request());

    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ response: 'ng', code: 'NEEDS_LOGIN' });
  });

  it('denies another member from reading a member secret post', async () => {
    setConsult('owner-id');
    setCookies({ session: 'valid-session' });
    verifySessionCookie.mockResolvedValue({ uid: 'other-id' });

    const response = await GET(request());

    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ response: 'ng', code: 'ACCESS_DENIED' });
  });

  it('allows the owner to read a member secret post', async () => {
    setConsult('owner-id');
    setCookies({ session: 'valid-session' });
    verifySessionCookie.mockResolvedValue({ uid: 'owner-id' });

    const response = await GET(request());

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      response: 'ok',
      code: 'OK',
      data: { phoneNumber: '01012345678' },
    });
  });

  it('allows an administrator to read a member secret post', async () => {
    setConsult('owner-id');
    setCookies({ session: 'admin-session' });
    verifySessionCookie.mockResolvedValue({ uid: 'admin-id' });
    userGet.mockResolvedValue({ exists: true, data: () => ({ grade: 'admin' }) });

    const response = await GET(request());

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      response: 'ok',
      code: 'OK',
      data: { phoneNumber: '01012345678' },
    });
    expect(verifySessionCookie).toHaveBeenLastCalledWith('admin-session', true);
  });
});
