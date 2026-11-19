import { jsonOrThrow } from '@/src/shared/api/request';
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

  return jsonOrThrow<T>(response);
}
