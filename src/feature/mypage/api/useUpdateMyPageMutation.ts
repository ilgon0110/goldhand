import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { myPageKeys, userKeys } from '@/src/shared/config/queryKeys';
import type { IMyPageResponseData, TAliasAny } from '@/src/shared/types';
import { authFetcher } from '@/src/shared/utils/fetcher.server';

interface IMyPageUpdateVariables {
  userId: string;
  name: string;
  nickname: string;
  email: string;
}

interface IResponsePostBody {
  response: string;
  message: string;
}

type TContext = {
  previous?: IMyPageResponseData | undefined;
  key?: readonly unknown[];
};

export function useUpdateMyPageMutation(
  options?: UseMutationOptions<IResponsePostBody, Error, IMyPageUpdateVariables, TContext>,
) {
  const queryClient = useQueryClient();

  const { isPending, mutate, isSuccess, isError } = useMutation<
    IResponsePostBody,
    Error,
    IMyPageUpdateVariables,
    TContext
  >({
    mutationFn: async (vars: IMyPageUpdateVariables) => {
      return authFetcher<IResponsePostBody>('/api/mypage/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vars),
        cache: 'no-store',
      });
    },

    onMutate: async (vars: IMyPageUpdateVariables) => {
      const key = myPageKeys.all;
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<IMyPageResponseData>(key);

      if (previous) {
        queryClient.setQueryData<IMyPageResponseData>(key, {
          ...previous,
          data: {
            ...previous.data,
            userData: previous.data.userData
              ? { ...previous.data.userData, name: vars.name, nickname: vars.nickname, email: vars.email }
              : previous.data.userData,
          },
        });
      }

      return { previous, key };
    },

    onError: (err, vars, context) => {
      if (context?.previous && context?.key) {
        queryClient.setQueryData(context.key, context.previous);
      }
      if (options?.onError) {
        options.onError(err as TAliasAny, vars as TAliasAny, context as TAliasAny);
      }
    },

    onSuccess: (data, vars, context) => {
      queryClient.invalidateQueries({ queryKey: myPageKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      if (options?.onSuccess) {
        options.onSuccess(data as TAliasAny, vars as TAliasAny, context as TAliasAny);
      }
    },

    ...options,
  });

  return { isPending, mutate, isSuccess, isError };
}
