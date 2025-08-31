'use server';

import { parse } from 'cookie';
import { headers } from 'next/headers';

// 로그인한 상태에서 쓸 수 있는 fetcher
export async function authFetcher<T>(path: string, options: RequestInit = {}): Promise<T> {
  const rawCookie = headers().get('cookie') || '';
  const cookiesObj = parse(rawCookie);
  const accessToken = cookiesObj['accessToken'];

  // if (accessToken === null) {
  //   throw new Error('로그인이 필요합니다.');
  // }

  const response = await fetch(`${path}`, {
    ...options,
    method: options.method || 'GET',
    headers: {
      ...options.headers,
      Cookie: `accessToken=${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: options.body,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || 'API 요청 실패');
  }

  return response.json() as Promise<T>;
}
