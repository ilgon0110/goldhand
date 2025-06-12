export const getReservationListData = async ({ page, hideSecret }: { page: number; hideSecret: string }) => {
  const apiUrl =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' ? process.env.NEXT_PUBLIC_API_URL : 'http://localhost:3000';

  const res = await fetch(`${apiUrl}/api/consult?page=${page}&hideSecret=${hideSecret}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    cache: 'no-store',
  });

  return res.json();
};
