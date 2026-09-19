import { randomBytes, timingSafeEqual } from 'node:crypto';

import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';

import { isSafeReservationRedirectPath } from '@/src/shared/lib/isSafeReservationRedirectPath';

export type TOAuthProvider = 'kakao' | 'naver';

const STATE_COOKIE_NAMES: Record<TOAuthProvider, string> = {
  kakao: 'oauth_state_kakao',
  naver: 'oauth_state_naver',
};

const REDIRECT_COOKIE_NAMES: Record<TOAuthProvider, string> = {
  kakao: 'oauth_redirect_to_kakao',
  naver: 'oauth_redirect_to_naver',
};

const STATE_COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 60 * 10,
  path: '/',
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
};

export function createOAuthState() {
  return randomBytes(32).toString('base64url');
}

function getOAuthStateCookieName(provider: TOAuthProvider) {
  return STATE_COOKIE_NAMES[provider];
}

function matchesOAuthState(expected: string | undefined, received: string | null) {
  if (!expected || !received) return false;

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  return expectedBuffer.length === receivedBuffer.length && timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function validateOAuthState(provider: TOAuthProvider, received: string | null) {
  const expected = cookies().get(getOAuthStateCookieName(provider))?.value;
  return matchesOAuthState(expected, received);
}

export function setOAuthStateCookie(response: NextResponse, provider: TOAuthProvider, state: string) {
  response.cookies.set(getOAuthStateCookieName(provider), state, STATE_COOKIE_OPTIONS);
  return response;
}

export function expireOAuthStateCookie(response: NextResponse, provider: TOAuthProvider) {
  response.cookies.set(getOAuthStateCookieName(provider), '', { ...STATE_COOKIE_OPTIONS, maxAge: 0 });
  return response;
}

export function setOAuthRedirectCookie(response: NextResponse, provider: TOAuthProvider, path: string) {
  response.cookies.set(REDIRECT_COOKIE_NAMES[provider], path, STATE_COOKIE_OPTIONS);
  return response;
}

export function getOAuthRedirectCookie(provider: TOAuthProvider) {
  return cookies().get(REDIRECT_COOKIE_NAMES[provider])?.value ?? null;
}

export function resolveOAuthRedirectDestination(provider: TOAuthProvider, fallback: string) {
  const redirectTo = getOAuthRedirectCookie(provider);
  // 클라이언트가 로그인 직후 도착했음을 알 수 있도록 표시해, useEffect 감지 없이
  // 첫 렌더에서 곧바로 로딩 상태를 보여주고 refresh를 걸 수 있게 한다.
  return isSafeReservationRedirectPath(redirectTo) ? `${redirectTo}?authReturn=1` : fallback;
}

export function expireOAuthRedirectCookie(response: NextResponse, provider: TOAuthProvider) {
  response.cookies.set(REDIRECT_COOKIE_NAMES[provider], '', { ...STATE_COOKIE_OPTIONS, maxAge: 0 });
  return response;
}
