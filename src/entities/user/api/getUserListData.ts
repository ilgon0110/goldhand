import { apiUrl } from '@/src/shared/config';
import type { IUserListResponseData } from '@/src/shared/types';

export const getUserListData = async ({ page }: { page: number }): Promise<IUserListResponseData> => {
  const res = await fetch(`${apiUrl}/api/user/list?page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-store',
    next: { revalidate: 0 },
  });

  return res.json();
};
