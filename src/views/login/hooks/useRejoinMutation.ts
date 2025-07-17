import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import { fetcher } from '@/app/utils';

interface IResponsePostBody {
  response: string;
  message: string;
}

export function useRejoinMutation(
  userId: string | undefined,
  options?: UseMutationOptions<IResponsePostBody, Error, void>,
) {
  const { isPending, mutate, isSuccess, isError } = useMutation({
    mutationFn: async () => {
      const rejoinData = await fetcher<IResponsePostBody>('/api/user/rejoin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
        cache: 'no-store',
      });

      return rejoinData;
    },
    ...options,
  });

  return {
    isSuccess,
    isError,
    isPending,
    mutate,
  };
}
