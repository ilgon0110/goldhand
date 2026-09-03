import { beforeEach, describe, expect, it, vi } from 'vitest';

const verifyIdToken = vi.hoisted(() => vi.fn());
const getUser = vi.hoisted(() => vi.fn());
const userDocumentGet = vi.hoisted(() => vi.fn());

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ get: vi.fn(() => ({ value: 'secret-id-token' })) })),
}));
vi.mock('firebase-admin/auth', () => ({
  getAuth: vi.fn(() => ({ getUser, verifyIdToken })),
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
    verifyIdToken.mockResolvedValue({ uid: 'verified-user' });
    getUser.mockResolvedValue({ providerData: [{ providerId: 'password' }, { providerId: 'phone' }] });
    userDocumentGet.mockResolvedValue({
      exists: true,
      data: () => ({ email: 'user@example.com', grade: 'basic', isDeleted: false }),
    });
  });

  it('does not expose the HttpOnly session token in a successful JSON response', async () => {
    const response = await GET();
    const body = await response.json();

    expect(body).not.toHaveProperty('accessToken');
  });

  it('marks the user response private and non-cacheable', async () => {
    const response = await GET();

    expect(response.headers.get('cache-control')).toBe('private, no-store');
  });

  it('does not expose the token when the verified user is deleted', async () => {
    userDocumentGet.mockResolvedValue({ exists: true, data: () => ({ isDeleted: true }) });

    const response = await GET();
    const body = await response.json();

    expect(body).not.toHaveProperty('accessToken');
    expect(response.headers.get('cache-control')).toBe('private, no-store');
  });

  it('does not expose the token when no user document exists', async () => {
    userDocumentGet.mockResolvedValue({ exists: false, data: () => undefined });

    const response = await GET();
    const body = await response.json();

    expect(body).not.toHaveProperty('accessToken');
    expect(response.headers.get('cache-control')).toBe('private, no-store');
  });
});
