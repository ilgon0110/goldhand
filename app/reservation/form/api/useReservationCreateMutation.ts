import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import type { IReservationCreatePostData } from '@/app/api/reservation/create/route';

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
  docId?: string;
}

const postReservationCreateApi = async (body: IReservationCreatePostData): Promise<IResponseBody> => {
  const res = await fetch('/api/reservation/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return res.json();
};

export const useReservationCreateMutation = (
  options?: UseMutationOptions<IResponseBody, unknown, IReservationCreatePostData>,
) => {
  return useMutation({
    mutationFn: postReservationCreateApi,
    ...options,
  });
};
