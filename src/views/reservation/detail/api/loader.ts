import { apiUrl } from '@/src/shared/config';
import type { IConsultDetailData } from '@/src/shared/types';

export const getConsultDetailData = async ({
  docId,
  password,
  userId,
}: {
  docId: string;
  password: string;
  userId: string | null;
}): Promise<IConsultDetailData> => {
  const res = await fetch(`${apiUrl}/api/consultDetail?docId=${docId}&password=${password}&userId=${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-store',
  });

  return res.json();
};
