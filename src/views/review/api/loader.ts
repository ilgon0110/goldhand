import { apiUrl, type TFranchiseeList } from '@/src/shared/config';
import type { IReviewResponseData } from '@/src/shared/types';
import type { IReviewData } from '@/src/views/review';

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

export async function getReviewListData(page: number, franchisee: TFranchiseeList): Promise<IReviewData> {
  const res: Response = await fetch(`${apiUrl}/api/review?page=${page}&franchisee=${franchisee}`, {
    cache: 'no-store',
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error('데이터 fetch 실패!!');
  }

  return res.json();
}
