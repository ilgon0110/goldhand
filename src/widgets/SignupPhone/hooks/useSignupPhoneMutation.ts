import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import type z from 'zod';

import { fetcher } from '@/src/shared/utils/fetcher.client';
import type { signupPhoneFormSchema } from '@/widgets/SignupPhone';

interface IResponsePostBody {
  response: string;
  message: string;
}

export function useSignupPhoneMutation(
  values: z.infer<typeof signupPhoneFormSchema>,
  options?: UseMutationOptions<IResponsePostBody, Error, void>,
) {
  const { isPending, mutate, isSuccess, isError } = useMutation({
    mutationFn: async () => {
      const signupData = await fetcher<IResponsePostBody>('/api/signup/phone', {
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
