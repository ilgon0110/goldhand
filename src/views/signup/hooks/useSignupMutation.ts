import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type z from 'zod';

import { fetcher } from '@/app/utils/fetcher.client';

import type { signUpFormSchema } from '../config/signUpFormSchema';

interface IResponsePostBody {
  response: string;
  message: string;
}

export function useSignupMutation(
  values: z.infer<typeof signUpFormSchema>,
  options?: UseMutationOptions<IResponsePostBody, Error, void>,
) {
  const { isPending, mutate, isSuccess, isError } = useMutation({
    mutationFn: async () => {
      const signupData = await fetcher<IResponsePostBody>('/api/signup', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ ...values }),
      });

      return signupData;
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
