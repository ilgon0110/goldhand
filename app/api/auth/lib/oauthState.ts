import { randomBytes, timingSafeEqual } from 'node:crypto';

import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';

export type TOAuthProvider = 'kakao' | 'naver';

const STATE_COOKIE_NAMES: Record<TOAuthProvider, string> = {
  kakao: 'oauth_state_kakao',
  naver: 'oauth_state_naver',
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
