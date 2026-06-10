import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { reviewKeys } from '@/src/shared/config/queryKeys';
import { fetcher } from '@/src/shared/utils/fetcher.client';

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
}

interface IDeletePayload {
  docId: string;
  userId: string | null;
}

export const useReviewDeleteMutation = (options?: UseMutationOptions<IResponseBody, Error, IDeletePayload>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IDeletePayload) =>
      fetcher<IResponseBody>('/api/review/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.all });
    },
    ...options,
  });
};
