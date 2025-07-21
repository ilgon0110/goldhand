import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import { fetcher } from '@/app/utils/fetcher.client';

interface IResponsePostBody {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
}

export function useWithdrawalMutation(options?: UseMutationOptions<IResponsePostBody, Error, void>) {
  const { isPending, mutate, isSuccess, isError } = useMutation({
    mutationFn: async () => {
      const withdrawalData = await fetcher<IResponsePostBody>('/api/user/withdrawal', {
        method: 'POST',
      });

      return withdrawalData;
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
