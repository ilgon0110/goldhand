import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import { authFetcher } from '@/src/shared/utils/fetcher.server';

interface IResponsePostBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
}

export const useCommentDeleteMutation = (
  type: 'event' | 'manager' | 'reservation' | 'review',
  options?: UseMutationOptions<
    IResponsePostBody,
    Error,
    {
      userId: string;
      docId: string;
      commentId: string;
    }
  >,
) => {
  return useMutation({
    mutationFn: async ({ userId, docId, commentId }) => {
      const response = await authFetcher<IResponsePostBody>(`/api/${type}/detail/comment/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, docId, commentId }),
        cache: 'no-store',
      });

      return response;
    },
    ...options,
  });
};
