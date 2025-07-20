import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import { fetcher } from '@/app/utils/fetcher.client';

interface IResponsePostBody {
  response: string;
  message: string;
}

export function useLogoutMutation(options?: UseMutationOptions<IResponsePostBody, Error, void>) {
  const { isPending, mutate, isSuccess, isError } = useMutation({
    mutationFn: async () => {
      const logoutData = await fetcher<IResponsePostBody>('/api/logout', {
        method: 'POST',
      });

      return logoutData;
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
