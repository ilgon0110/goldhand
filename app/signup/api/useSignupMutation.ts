import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type z from 'zod';

import { userKeys } from '@/src/shared/config/queryKeys';
import { fetcher } from '@/src/shared/utils/fetcher.client';

import type { signUpFormSchema } from '../config';

interface IResponsePostBody {
  response: string;
  message: string;
}

export function useSignupMutation(
  values: z.infer<typeof signUpFormSchema>,
  options?: UseMutationOptions<IResponsePostBody, Error, void>,
) {
  const queryClient = useQueryClient();
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
    // 서버의 user 정보가 바뀌었으므로 헤더 등 user 캐시를 갱신한다(성공 후 router.replace('/')는 user를 다시 prefetch하지 않는다).
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      return options?.onSuccess?.(...args);
    },
  });

  return {
    isSuccess,
    isError,
    isPending,
    mutate,
  };
}
