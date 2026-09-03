import { beforeEach, describe, expect, it, vi } from 'vitest';

const cookieGet = vi.hoisted(() => vi.fn());

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({ get: cookieGet })),
}));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('firebase/firestore', () => ({ Timestamp: { now: vi.fn() } }));
vi.mock('firebase-admin/firestore', () => ({ getFirestore: vi.fn() }));
vi.mock('@/src/shared/config', () => ({ apiUrl: 'https://nicegoldhand.com' }));
vi.mock('@/src/shared/config/firebase-admin', () => ({ firebaseAdminApp: {} }));
vi.mock('@/app/api/auth/lib/socialAuth', () => ({
  checkUserDeletedStatus: vi.fn(),
  signUpUser: vi.fn(),
  trySignIn: vi.fn(),
}));

import { GET as kakaoCallback } from '@/app/api/auth/kakao/callback/route';
import { GET as kakaoStart } from '@/app/api/auth/kakao/start/route';
import { validateOAuthState } from '@/app/api/auth/lib/oauthState';
import { GET as naverCallback } from '@/app/api/auth/naver/callback/route';
import { GET as naverStart } from '@/app/api/auth/naver/start/route';

const readState = (response: Response, provider: 'kakao' | 'naver') => {
  const cookie = response.headers.get('set-cookie') ?? '';
  return cookie.match(new RegExp(`oauth_state_${provider}=([^;]+)`))?.[1];
};

describe('OAuth login start', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_KAKAO_REST_API_KEY', 'kakao-client');
    vi.stubEnv('NEXT_PUBLIC_KAKAO_CALLBACK_URL', 'https://nicegoldhand.com/api/auth/kakao/callback');
    vi.stubEnv('NEXT_PUBLIC_NAVER_CLIENT_ID', 'naver-client');
    vi.stubEnv('NEXT_PUBLIC_NAVER_CALLBACK_URL', 'https://nicegoldhand.com/api/auth/naver/callback');
  });

  it.each([
    ['kakao', kakaoStart, 'https://kauth.kakao.com/oauth/authorize'],
    ['naver', naverStart, 'https://nid.naver.com/oauth2.0/authorize'],
  ] as const)('creates a browser-bound state for %s before redirecting to the provider', (provider, start, origin) => {
    const response = start();
    const location = new URL(response.headers.get('location')!);
    const state = readState(response, provider);

    expect(`${location.origin}${location.pathname}`).toBe(origin);
    expect(state).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(location.searchParams.get('state')).toBe(state);
    expect(response.headers.get('set-cookie')).toMatch(/HttpOnly/i);
    expect(response.headers.get('set-cookie')).toMatch(/SameSite=lax/i);
    expect(response.headers.get('set-cookie')).toMatch(/Path=\//i);
  });

  it('creates a fresh state for every login attempt', () => {
    expect(readState(kakaoStart(), 'kakao')).not.toBe(readState(kakaoStart(), 'kakao'));
  });
});

describe('OAuth callback state validation', () => {
  beforeEach(() => {
    cookieGet.mockReset();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
  });

  it.each([
    ['kakao', 'oauth_state_kakao'],
    ['naver', 'oauth_state_naver'],
  ] as const)('validates the received state against the %s state cookie', (provider, cookieName) => {
    cookieGet.mockImplementation((name: string) =>
      name === cookieName ? { value: 'matching-state' } : undefined,
    );

    expect(validateOAuthState(provider, 'matching-state')).toBe(true);
    expect(validateOAuthState(provider, 'wrong-state')).toBe(false);
    expect(validateOAuthState(provider, null)).toBe(false);
    expect(cookieGet).toHaveBeenCalledWith(cookieName);
  });

  it('rejects a mismatched Kakao state before exchanging the authorization code and expires the state cookie', async () => {
    cookieGet.mockReturnValue({ value: 'expected-state' });

    const response = await kakaoCallback(
      new Request('https://nicegoldhand.com/api/auth/kakao/callback?code=attacker-code&state=wrong-state'),
    );

    expect(response.headers.get('location')).toBe('https://nicegoldhand.com/login?kakao_error=invalid_state');
    expect(response.headers.get('set-cookie')).toContain('oauth_state_kakao=');
    expect(response.headers.get('set-cookie')).toMatch(/Max-Age=0/i);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects a missing Naver state cookie before exchanging the authorization code and expires the state cookie', async () => {
    cookieGet.mockReturnValue(undefined);

    const response = await naverCallback(
      new Request('https://nicegoldhand.com/api/auth/naver/callback?code=attacker-code&state=provided-state'),
    );

    expect(response.headers.get('location')).toBe('https://nicegoldhand.com/login?naver_error=invalid_state');
    expect(response.headers.get('set-cookie')).toContain('oauth_state_naver=');
    expect(response.headers.get('set-cookie')).toMatch(/Max-Age=0/i);
    expect(fetch).not.toHaveBeenCalled();
  });

  it('exchanges a Kakao authorization code only when the state matches and consumes the state', async () => {
    cookieGet.mockReturnValue({ value: 'matching-state' });

    const response = await kakaoCallback(
      new Request('https://nicegoldhand.com/api/auth/kakao/callback?code=valid-code&state=matching-state'),
    );

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(response.headers.get('location')).toBe('https://nicegoldhand.com/login?kakao_error=token_exchange_failed');
    expect(response.headers.get('set-cookie')).toMatch(/oauth_state_kakao=;.*Max-Age=0/i);
  });

  it('rejects replay after the state cookie has been consumed', async () => {
    cookieGet.mockReturnValueOnce({ value: 'one-time-state' }).mockReturnValueOnce(undefined);
    const requestUrl = 'https://nicegoldhand.com/api/auth/naver/callback?code=valid-code&state=one-time-state';

    await naverCallback(new Request(requestUrl));
    vi.mocked(fetch).mockClear();
    const replayResponse = await naverCallback(new Request(requestUrl));

    expect(replayResponse.headers.get('location')).toBe('https://nicegoldhand.com/login?naver_error=invalid_state');
    expect(fetch).not.toHaveBeenCalled();
  });
});
