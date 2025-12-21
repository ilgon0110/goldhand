import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { notificationKeys } from '@/src/shared/config/queryKeys';
import type { INotificationDetailData, INotificationResponseData, TAliasAny } from '@/src/shared/types';
import { authFetcher } from '@/src/shared/utils/fetcher.server';

interface IResponsePostBody {
  response: string;
  message: string;
  type: string;
  docId: string;
}

interface INotificationVariables {
  userId: string;
  notificationId: string;
  markAsRead?: boolean;
}

type TContext = {
  previous?: INotificationResponseData | undefined;
  key?: readonly unknown[];
};

export function useNotificationMutation(
  options?: UseMutationOptions<IResponsePostBody, Error, INotificationVariables, TContext>,
) {
  const queryClient = useQueryClient();

  const { isPending, mutate, isSuccess, isError, reset } = useMutation<
    IResponsePostBody,
    Error,
    INotificationVariables,
    TContext
  >({
    mutationFn: async (vars: INotificationVariables) => {
      const notificationData = await authFetcher<IResponsePostBody>('/api/alarm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: vars.userId, notificationId: vars.notificationId, markAsRead: vars.markAsRead }),
        cache: 'no-store',
      });

      return notificationData;
    },

    onMutate: async (vars: INotificationVariables) => {
      const key = notificationKeys.list(vars.userId);
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<INotificationResponseData>(key);

      if (previous) {
        const newData: INotificationResponseData = {
          ...previous,
          data: (previous.data ?? []).map((noti: INotificationDetailData) => {
            if (vars.markAsRead) {
              return { ...noti, isRead: true };
            }
            if (vars.notificationId && noti.id === vars.notificationId) {
              return { ...noti, isRead: true };
            }
            return noti;
          }),
        };
        queryClient.setQueryData<INotificationResponseData>(key, newData);
      }

      return { previous, key };
    },
    // 에러 발생 시 롤백
    onError: (err, vars, context) => {
      if (context?.previous && context?.key) {
        queryClient.setQueryData(context.key, context.previous);
      }
      // 사용자가 전달한 onError 호출(있을 경우)
      if (options?.onError) {
        // 타입 호환을 위해 any 사용
        // onError signature: (error, variables, context) => void
        options.onError(err as TAliasAny, vars as TAliasAny, context as TAliasAny);
      }
    },

    // 성공 또는 실패 후(항상) 서버와 동기화
    onSettled: (data, error, vars, context) => {
      const key = context?.key ?? notificationKeys.list(vars.userId);
      queryClient.invalidateQueries({ queryKey: key });

      if (options?.onSettled) {
        // onSettled signature: (data, error, variables, context) => void
        options.onSettled(data as TAliasAny, error as TAliasAny, vars as TAliasAny, context as TAliasAny);
      }
    },

    // 성공 콜백 연결(사용자 콜백도 호출)
    onSuccess: (data, vars, context) => {
      if (options?.onSuccess) {
        // onSuccess signature: (data, variables, context) => void
        options.onSuccess(data as TAliasAny, vars as TAliasAny, context as TAliasAny);
      }
    },

    ...options,
  });

  return {
    isSuccess,
    isError,
    isPending,
    mutate,
    reset,
  };
}
