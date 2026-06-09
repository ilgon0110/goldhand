'use server';

import { parse } from 'cookie';
import { headers } from 'next/headers';

import { apiUrl } from '../config';

// 로그인한 상태에서 쓸 수 있는 fetcher
export async function authFetcher<T>(path: string, options: RequestInit = {}): Promise<T> {
  const rawCookie = headers().get('cookie') || '';
  const cookiesObj = parse(rawCookie);
  const accessToken = cookiesObj['accessToken'];

  if (accessToken == null || accessToken.trim() === '') {
    throw new Error('인증 토큰이 없습니다. 로그인 후 이용해주세요.');
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    method: options.method || 'GET',
    headers: {
      ...options.headers,
      Cookie: `accessToken=${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: options.body,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || 'API 요청 실패');
  }

  return result as T;
}
