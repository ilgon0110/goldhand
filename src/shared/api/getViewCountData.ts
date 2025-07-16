import { apiUrl } from '../config';
import type { IViewCountResponseData } from '../types';

export const getViewCountData = async ({ docId }: { docId: string }): Promise<IViewCountResponseData> => {
  const res = await fetch(`${apiUrl}/api/viewCount?docId=${docId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.json();
};
