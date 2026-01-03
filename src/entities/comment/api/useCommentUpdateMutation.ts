import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import { authFetcher } from '@/src/shared/utils/fetcher.server';

interface IResponsePostBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
}

export const useCommentUpdateMutation = (
  type: 'event' | 'manager' | 'reservation' | 'review',
  options?: UseMutationOptions<
    IResponsePostBody,
    Error,
    {
      docId: string;
      commentId: string;
      comment: string;
    }
  >,
) => {
  return useMutation({
    mutationFn: async ({ docId, commentId, comment }) => {
      const response = await authFetcher<IResponsePostBody>(`/api/${type}/detail/comment/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ docId, commentId, comment }),
        cache: 'no-store',
      });

      return response;
    },
    ...options,
  });
};
