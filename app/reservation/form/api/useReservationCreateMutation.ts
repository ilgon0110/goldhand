import type { QueryKey, UseMutationOptions } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { IReservationCreatePostData } from '@/app/api/reservation/create/route';
import { reservationKeys } from '@/src/shared/config/queryKeys';
import type { IReservationDetailData } from '@/src/shared/types';

interface IResponseBody {
  response: 'ng' | 'ok';
  message: string;
  docId?: string;
}

type TListData = {
  message: string;
  consultData: (IReservationDetailData & { id: string })[] | null;
  totalDataLength: number;
};

type TContext = { listQueriesData: [QueryKey, TListData | undefined][] };

const postReservationCreateApi = async (body: IReservationCreatePostData): Promise<IResponseBody> => {
  const res = await fetch('/api/reservation/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);
  return res.json();
};

export const useReservationCreateMutation = (
  options?: UseMutationOptions<IResponseBody, Error, IReservationCreatePostData, TContext>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postReservationCreateApi,
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: reservationKeys.lists() });

      const listQueriesData = queryClient.getQueriesData<TListData>({ queryKey: reservationKeys.lists() });

      const tempItem: IReservationDetailData & { id: string } = {
        id: `temp-${Date.now()}`,
        title: variables.title,
        content: variables.content,
        location: variables.location,
        franchisee: variables.franchisee,
        secret: variables.secret,
        name: variables.name,
        phoneNumber: variables.phoneNumber,
        bornDate: variables.bornDate != null ? variables.bornDate.toISOString() : null,
        userId: variables.userId ?? null,
        password: null,
        createdAt: { nanoseconds: 0, seconds: Math.floor(Date.now() / 1000) },
        updatedAt: { nanoseconds: 0, seconds: Math.floor(Date.now() / 1000) },
        comments: null,
      };

      for (const [queryKey, previousData] of listQueriesData) {
        if (!previousData?.consultData) continue;
        queryClient.setQueryData<TListData>(queryKey as QueryKey, {
          ...previousData,
          consultData: [tempItem, ...previousData.consultData],
          totalDataLength: previousData.totalDataLength + 1,
        });
      }

      return { listQueriesData };
    },
    onError: (_error, _variables, context) => {
      if (context?.listQueriesData) {
        for (const [queryKey, previousData] of context.listQueriesData) {
          queryClient.setQueryData(queryKey, previousData);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationKeys.all });
    },
    ...options,
  });
};
