import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import type { IConsultPost } from '@/app/api/reservation/update/route';

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
}

const postReservationEditApi = async (body: IConsultPost): Promise<IResponseBody> => {
  const res = await fetch('/api/reservation/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'API 요청 실패');
  }

  return data;
};

export const useReservationEditMutation = (options?: UseMutationOptions<IResponseBody, unknown, IConsultPost>) => {
  return useMutation({
    mutationFn: postReservationEditApi,
    ...options,
  });
};
