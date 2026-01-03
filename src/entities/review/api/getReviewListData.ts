import type { TFranchiseeList } from '@/src/shared/config';
import { apiUrl } from '@/src/shared/config';
import type { IReviewListResponseData } from '@/src/shared/types';

export async function getReviewListData(page: number, franchisee: TFranchiseeList): Promise<IReviewListResponseData> {
  const res: Response = await fetch(`${apiUrl}/api/review?page=${page}&franchisee=${franchisee}`, {
    cache: 'no-store',
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    throw new Error('데이터 fetch 실패!!');
  }

  return res.json();
}
