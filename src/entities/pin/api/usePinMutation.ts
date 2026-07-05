'use client';

import type { UseMutationOptions } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { eventKeys, reservationKeys, reviewKeys } from '@/src/shared/config/queryKeys';
import { fetcher } from '@/src/shared/utils/fetcher.client';

export type TPinDomain = 'event' | 'reservation' | 'review';

interface IPinMutationVariables {
  docId: string;
  isPinned: boolean;
}

interface IPinResponseBody {
  response: 'ng' | 'ok';
  message: string;
}

const domainKeys = {
  review: reviewKeys,
  reservation: reservationKeys,
  event: eventKeys,
} as const;

export const usePinMutation = (
  domain: TPinDomain,
  options?: UseMutationOptions<IPinResponseBody, Error, IPinMutationVariables>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: IPinMutationVariables) =>
      fetcher<IPinResponseBody>(`/api/${domain}/pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(variables),
        cache: 'no-store',
      }),
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: domainKeys[domain].all });
      options?.onSuccess?.(...args);
    },
  });
};
