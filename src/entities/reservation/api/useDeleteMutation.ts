'use client';

import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import { fetcher } from '@/src/shared/utils/fetcher.client';

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
}

interface IDeletePostPayload {
  docId: string;
  userId: string | null;
  password: string;
}

export const useDeletePostMutation = (options?: UseMutationOptions<IResponseBody, Error, IDeletePostPayload>) => {
  return useMutation({
    mutationFn: (payload: IDeletePostPayload) =>
      fetcher<IResponseBody>('/api/reservation/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      }),
    ...options,
  });
};
