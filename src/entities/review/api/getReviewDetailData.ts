import { apiUrl } from '@/src/shared/config';
import type { IReviewResponseData } from '@/src/shared/types';

export const getReviewDetailData = async ({ docId }: { docId: string }): Promise<IReviewResponseData> => {
  const res: Response = await fetch(`${apiUrl}/api/review/detail?docId=${docId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-store',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'API 요청 실패');
  }

  return data;
};
