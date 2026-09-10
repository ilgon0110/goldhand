'use server';

import { parse } from 'cookie';
import { headers } from 'next/headers';

import { apiUrl } from '@/src/shared/config';
import type { IReservationResponseData } from '@/src/shared/types';

export const getReservationDetailData = async ({ docId }: { docId: string }): Promise<IReservationResponseData> => {
  const rawCookie = headers().get('cookie') || '';
  const cookiesObj = parse(rawCookie);
  const session = cookiesObj['session'];
  const reservationToken = cookiesObj['reservationToken'];
  const res = await fetch(`${apiUrl}/api/reservation/detail?docId=${docId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `session=${session}; reservationToken=${reservationToken}`,
    },
    credentials: 'include',
    cache: 'no-store',
  });

  return res.json();
};
