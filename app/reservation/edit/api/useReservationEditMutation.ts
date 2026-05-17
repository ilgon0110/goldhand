import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import type { IConsultPost } from '@/app/api/reservation/update/route';

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
}

const postReservationApi = async (body: IConsultPost): Promise<IResponseBody> => {
  return await fetch('/api/reservation/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(res => res.json());
};

export const useReservationMutation = (options?: UseMutationOptions<IResponseBody, unknown, IConsultPost>) => {
  return useMutation({
    mutationFn: postReservationApi,
    ...options,
  });
};
