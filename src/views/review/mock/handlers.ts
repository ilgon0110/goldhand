import { apiUrl } from '@/src/shared/config';

export async function getData(page: number) {
  const res: Response = await fetch(`${apiUrl}/api/review?page=${page}`);

  if (!res.ok) {
    throw new Error('데이터 fetch 실패!!');
  }

  return res.json();
}
