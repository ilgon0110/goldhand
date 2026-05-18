import type { IEventListResponseData, IEventResponseData } from '@/src/shared/types';
import { fetcher } from '@/src/shared/utils/fetcher.client';

export const getEventDetailData = async ({ docId }: { docId: string }): Promise<IEventResponseData> => {
  const res: IEventResponseData = await fetcher(`/api/event/detail?docId=${docId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-store',
  });

  return res;
};

export async function getEventListData(page: number, status: string): Promise<IEventListResponseData> {
  const res: IEventListResponseData = await fetcher(`/api/event?page=${page}&status=${status}`, {
    cache: 'no-store',
  });

  return res;
}
