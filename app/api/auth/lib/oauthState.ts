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

// state 쿠키와 redirect 쿠키를 함께 만료시킨다.
export function expireOAuthStateCookie(response: NextResponse, provider: TOAuthProvider) {
  const expired = { ...STATE_COOKIE_OPTIONS, maxAge: 0 };
  response.cookies.set(getOAuthStateCookieName(provider), '', expired);
  response.cookies.set(REDIRECT_COOKIE_NAMES[provider], '', expired);
  return response;
}

// 이전 로그인 시도에서 남은 쿠키가 다른 로그인에 소비되지 않도록, 안전하지 않은 경로면 만료시킨다.
export function setOAuthRedirectCookie(response: NextResponse, provider: TOAuthProvider, path: string | null) {
  const safe = isSafeReservationRedirectPath(path);
  response.cookies.set(
    REDIRECT_COOKIE_NAMES[provider],
    safe ? path : '',
    safe ? STATE_COOKIE_OPTIONS : { ...STATE_COOKIE_OPTIONS, maxAge: 0 },
  );
  return response;
}

export function resolveOAuthRedirectDestination(provider: TOAuthProvider, fallback: string) {
  const redirectTo = cookies().get(REDIRECT_COOKIE_NAMES[provider])?.value;
  // 클라이언트가 로그인 직후 도착했음을 알 수 있도록 표시해, useEffect 감지 없이
  // 첫 렌더에서 곧바로 로딩 상태를 보여주고 refresh를 걸 수 있게 한다.
  return isSafeReservationRedirectPath(redirectTo) ? `${redirectTo}?authReturn=1` : fallback;
}
