import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import { authFetcher } from '@/src/shared/utils/fetcher.server';

interface IResponsePostBody {
  response: 'expired' | 'ng' | 'ok' | 'unAuthorized';
  message: string;
}

export const useReviewDetailCommentMutation = (
  docId: string,
  options?: UseMutationOptions<IResponsePostBody, Error, string>,
) => {
  return useMutation({
    mutationFn: async (comment: string) => {
      const response = await authFetcher<IResponsePostBody>('/api/review/detail/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ docId, comment }),
        cache: 'no-store',
      });

      return response;
    },
    ...options,
  });
};
