import { notFound } from 'next/navigation';

import { apiUrl } from '@/src/shared/config';
import type { IEventListResponseData, IEventResponseData } from '@/src/shared/types';
import { fetcher } from '@/src/shared/utils/fetcher.client';

export const getEventDetailData = async ({ docId }: { docId: string }): Promise<IEventResponseData> => {
  const res = await fetch(`${apiUrl}/api/event/detail?docId=${docId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-store',
  });

  if (res.status === 404) {
    notFound();
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'API 요청 실패');
  }

  return data as IEventResponseData;
};

export async function getEventListData(page: number, status: string): Promise<IEventListResponseData> {
  const res: IEventListResponseData = await fetcher(`/api/event?page=${page}&status=${status}`, {
    cache: 'no-store',
  });

  return res;
}
