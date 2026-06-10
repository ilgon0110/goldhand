import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { IConsultPost } from '@/app/api/reservation/update/route';
import { reservationKeys } from '@/src/shared/config/queryKeys';
import type { IReservationResponseData } from '@/src/shared/types';

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
}

type TContext = { previousData: IReservationResponseData | undefined };

const postReservationEditApi = async (body: IConsultPost): Promise<IResponseBody> => {
  const res = await fetch('/api/reservation/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || 'API 요청 실패');
  }

  return data;
};

export const useReservationEditMutation = (
  options?: UseMutationOptions<IResponseBody, Error, IConsultPost, TContext>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postReservationEditApi,
    onMutate: async variables => {
      const queryKey = reservationKeys.detail(variables.docId);
      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<IReservationResponseData>(queryKey);

      if (previousData) {
        queryClient.setQueryData<IReservationResponseData>(queryKey, {
          ...previousData,
          data: {
            ...previousData.data,
            title: variables.title,
            content: variables.content,
            location: variables.location,
            franchisee: variables.franchisee,
            secret: variables.secret,
            name: variables.name,
            phoneNumber: variables.phoneNumber,
            bornDate: variables.bornDate != null ? variables.bornDate.toISOString() : null,
          },
        });
      }

      return { previousData };
    },
    onError: (_error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(reservationKeys.detail(variables.docId), context.previousData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
    ...options,
  });
};
