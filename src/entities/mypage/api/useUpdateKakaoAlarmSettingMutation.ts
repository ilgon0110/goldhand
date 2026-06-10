import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { myPageKeys } from '@/src/shared/config/queryKeys';
import type { IKakaoAlarmSettings, IMyPageResponseData, TAliasAny } from '@/src/shared/types';
import { authFetcher } from '@/src/shared/utils/fetcher.server';

interface IKakaoAlarmUpdateVariables {
  key: keyof IKakaoAlarmSettings;
  value: boolean;
}

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
}

type TContext = {
  previous?: IMyPageResponseData;
  key?: readonly unknown[];
};

export const DEFAULT_ALARM_SETTINGS: IKakaoAlarmSettings = {
  alarmComment: true,
  alarmNews: true,
  alarmNewPost: true,
  alarmEditPost: false,
  alarmNewComment: true,
  alarmEditComment: false,
};

export function useUpdateKakaoAlarmSettingMutation(
  options?: UseMutationOptions<IResponseBody, Error, IKakaoAlarmUpdateVariables, TContext>,
) {
  const queryClient = useQueryClient();

  const { isPending, mutate, isSuccess, isError } = useMutation<
    IResponseBody,
    Error,
    IKakaoAlarmUpdateVariables,
    TContext
  >({
    mutationFn: async (vars: IKakaoAlarmUpdateVariables) => {
      return authFetcher<IResponseBody>('/api/mypage/kakao-alarm', {
        method: 'POST',
        body: JSON.stringify(vars),
        cache: 'no-store',
      });
    },

    onMutate: async (vars: IKakaoAlarmUpdateVariables) => {
      const key = myPageKeys.all;
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<IMyPageResponseData>(key);

      if (previous?.data.userData) {
        queryClient.setQueryData<IMyPageResponseData>(key, {
          ...previous,
          data: {
            ...previous.data,
            userData: {
              ...previous.data.userData,
              kakaoAlarmSettings: {
                ...DEFAULT_ALARM_SETTINGS,
                ...previous.data.userData.kakaoAlarmSettings,
                [vars.key]: vars.value,
              },
            },
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
      if (options?.onSuccess) {
        options.onSuccess(data as TAliasAny, vars as TAliasAny, context as TAliasAny);
      }
    },

    ...options,
  });

  return { isPending, mutate, isSuccess, isError };
}
