import { apiUrl } from '@/src/shared/config';

// 로그인을 하지 않은 상태에서도 쓸 수 있는 fechter
export async function fetcher<T>(path: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = apiUrl || '';
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    method: options.method || 'GET',
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
    body: options.body,
  });

  const result = await response.json();

  // API 요청이 성공한 경우
  if (response.ok) {
    return result as T;
  }
  // API 요청이 실패한 경우
  else {
    throw new Error(result?.message || 'API 요청 실패');
  }
}
