import type { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { cookieGet, getUserData } = vi.hoisted(() => ({
  cookieGet: vi.fn(),
  getUserData: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ get: cookieGet })),
}));

vi.mock('@/src/shared/api/getUserData', () => ({
  getUserData,
}));

import { middleware } from '@/middleware';

function makeRequest(pathname: string): NextRequest {
  const url = new URL(`http://localhost${pathname}`);
  (url as unknown as { clone: () => URL }).clone = () => new URL(url.href);
  return { nextUrl: url } as unknown as NextRequest;
}

describe('middleware', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', 'development');
    vi.stubEnv('NEXT_PUBLIC_LOCAL_API_URL', 'http://localhost:3000');
    cookieGet.mockReset().mockReturnValue(undefined);
    getUserData.mockReset();
  });

  it('session 쿠키가 없으면 getUserData를 호출하지 않고도 /manager/list에서 로그인으로 리다이렉트한다 (게스트가 그대로 통과해버리던 회귀 방지)', async () => {
    cookieGet.mockReturnValue(undefined);

    const response = await middleware(makeRequest('/manager/list'));

    expect(getUserData).not.toHaveBeenCalled();
    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/login');
  });

  it('session 쿠키가 있어도 검증에 실패하면(응답이 ok가 아니면) /manager/list에서 로그인으로 리다이렉트한다', async () => {
    cookieGet.mockReturnValue({ value: 'expired-session-cookie' });
    getUserData.mockResolvedValue({ response: 'ng', userData: null });

    const response = await middleware(makeRequest('/manager/list'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/login');
  });

  it('세션이 없어도 게스트가 접근 가능한 경로(/reservation/form)는 통과시킨다', async () => {
    cookieGet.mockReturnValue(undefined);

    const response = await middleware(makeRequest('/reservation/form'));

    expect(getUserData).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });

  it('session 쿠키가 있어도 관리자가 아니면 /manager/list에서 로그인으로 리다이렉트한다', async () => {
    cookieGet.mockReturnValue({ value: 'valid-session-cookie' });
    getUserData.mockResolvedValue({ response: 'ok', userData: { grade: 'basic' } });

    const response = await middleware(makeRequest('/manager/list'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/login');
  });

  it('session 쿠키가 있고 관리자면 /manager/list를 통과시킨다', async () => {
    cookieGet.mockReturnValue({ value: 'valid-session-cookie' });
    getUserData.mockResolvedValue({ response: 'ok', userData: { grade: 'admin' } });

    const response = await middleware(makeRequest('/manager/list'));

    expect(response.headers.get('location')).toBeNull();
  });

  it('로그인하지 않은 상태로 /signup에 접근하면 로그인으로 리다이렉트한다', async () => {
    cookieGet.mockReturnValue(undefined);

    const response = await middleware(makeRequest('/signup'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/login');
  });

  it('이미 로그인한 상태로 /login에 접근하면 마이페이지로 리다이렉트한다', async () => {
    cookieGet.mockReturnValue({ value: 'valid-session-cookie' });
    getUserData.mockResolvedValue({ response: 'ok', userData: { grade: 'basic' } });

    const response = await middleware(makeRequest('/login'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/mypage');
  });

  it('로그인하지 않은 상태로 /login에 접근하면 통과시킨다', async () => {
    cookieGet.mockReturnValue(undefined);

    const response = await middleware(makeRequest('/login'));

    expect(getUserData).not.toHaveBeenCalled();
    expect(response.headers.get('location')).toBeNull();
  });

  it('/reservation/apply는 로그인 여부와 무관하게 항상 /reservation/form으로 리다이렉트한다', async () => {
    cookieGet.mockReturnValue(undefined);

    const response = await middleware(makeRequest('/reservation/apply'));

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toBe('http://localhost:3000/reservation/form');
  });
});
