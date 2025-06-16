'use server';
import { parse } from 'cookie';
import { headers } from 'next/headers';

// 로그인을 하지 않은 상태에서도 쓸 수 있는 fechter
export async function fetcher<T>(path: string, options: RequestInit = {}): Promise<T> {
  const apiUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' ? process.env.NEXT_PUBLIC_API_URL : 'http://127.0.0.1:3000';

  const response = await fetch(`${apiUrl}${path}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  // API 요청이 성공한 경우
  const result = await response.json();

  console.log('fetcher response', response);
  console.log('fetcher result', result);
  if (response.ok) {
    return result as T;
  }
  // API 요청이 실패한 경우
  else {
    throw new Error(result?.message || 'API 요청 실패');
  }
}

// 로그인한 상태에서 쓸 수 있는 fechter
export async function authFetcher<T>(path: string, options: RequestInit = {}): Promise<T> {
  const rawCookie = headers().get('cookie') || '';
  const cookiesObj = parse(rawCookie);
  const accessToken = cookiesObj['accessToken'];

  if (accessToken === null) {
    throw new Error('로그인이 필요합니다.');
  }

  return fetcher<T>(path, {
    ...options,
    headers: {
      ...options.headers,
      Cookie: `accessToken=${accessToken}`,
    },
  });
}
