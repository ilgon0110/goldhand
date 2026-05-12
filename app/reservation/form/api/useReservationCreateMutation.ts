import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import type { IReservationCreatePostData } from '@/app/api/reservation/create/route';

interface IResponseBody {
  response: 'expired' | 'ok' | 'ng';
  message: string;
  docId?: string;
}

const postReservationCreateApi = async (body: IReservationCreatePostData): Promise<IResponseBody> => {
  return await fetch('/api/reservation/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(res => res.json());
};

export const useReservationCreateMutation = (
  options?: UseMutationOptions<IResponseBody, unknown, IReservationCreatePostData>,
) => {
  return useMutation({
    mutationFn: postReservationCreateApi,
    ...options,
  });
};
