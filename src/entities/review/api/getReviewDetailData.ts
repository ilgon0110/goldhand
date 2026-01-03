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

  return res.json();
};
