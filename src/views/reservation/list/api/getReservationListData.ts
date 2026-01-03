import { apiUrl } from '@/src/shared/config';

export const getReservationListData = async ({ page, hideSecret }: { page: number; hideSecret: string }) => {
  const res = await fetch(`${apiUrl}/api/reservation?page=${page}&hideSecret=${hideSecret}`, {
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
