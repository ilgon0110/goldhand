import type { TFranchiseeList } from '@/src/shared/config';
import type { IReviewDetailData } from '@/src/shared/types';

export const getReviewDetailData = async ({ docId }: { docId: string }): Promise<IReviewDetailData> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' ? process.env.NEXT_PUBLIC_API_URL : 'http://localhost:3000';

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

export async function getReviewListData(page: number, franchisee: TFranchiseeList) {
  const apiUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' ? process.env.NEXT_PUBLIC_API_URL : 'http://localhost:3000';
  const res: Response = await fetch(`${apiUrl}/api/review?page=${page}&franchisee=${franchisee}`, {
    cache: 'no-cache',
  });
  -0;
  if (!res.ok) {
    throw new Error('데이터 fetch 실패!!');
  }

  return res.json();
}
