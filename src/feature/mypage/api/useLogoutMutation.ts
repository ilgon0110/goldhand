import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';

import { logoutAction } from './logoutAction';

interface IResponsePostBody {
  response: string;
  message: string;
}

export function useLogoutMutation(options?: UseMutationOptions<IResponsePostBody, Error, void>) {
  const { isPending, mutate, isSuccess, isError } = useMutation({
    mutationFn: () => logoutAction(),
    ...options,
  });

  return {
    isSuccess,
    isError,
    isPending,
    mutate,
  };
}
