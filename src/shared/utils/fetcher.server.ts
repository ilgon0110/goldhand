'use server';

import { parse } from 'cookie';
import { headers } from 'next/headers';

import { apiUrl } from '../config';

// 로그인한 상태에서 쓸 수 있는 fetcher
export async function authFetcher<T>(path: string, options: RequestInit = {}): Promise<T> {
  // 'use server'라 클라이언트가 path를 임의로 보낼 수 있다. `@host` 등으로 apiUrl의 host가 바뀌는 SSRF를 막기 위해 자기 API 경로만 허용한다.
  if (!path.startsWith('/api/')) {
    throw new Error('허용되지 않은 요청 경로입니다.');
  }

  const rawCookie = headers().get('cookie') || '';
  const cookiesObj = parse(rawCookie);
  const session = cookiesObj['session'];

  if (session == null || session.trim() === '') {
    throw new Error('인증 토큰이 없습니다. 로그인 후 이용해주세요.');
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    method: options.method || 'GET',
    headers: {
      ...options.headers,
      Cookie: `session=${session}`,
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
