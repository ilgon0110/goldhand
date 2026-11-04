import { useMutation, useQueryClient } from '@tanstack/react-query';

import { priceKeys } from '@/src/shared/config/queryKeys';
import { authFetcher } from '@/src/shared/utils/fetcher.server';

import type { TPriceData } from '../model/prices';

export const useUpdatePriceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: TPriceData) =>
      authFetcher<TPriceData>('/api/price', { method: 'PUT', body: JSON.stringify(variables), cache: 'no-store' }),
    // 응답이 저장된 최신 값이므로 재조회 없이 캐시만 교체한다.
    onSuccess: data => queryClient.setQueryData(priceKeys.all, data),
  });
};
