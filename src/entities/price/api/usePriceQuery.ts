import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { clientGet, jsonOrThrow, type TGet } from '@/src/shared/api/request';
import { priceKeys } from '@/src/shared/config/queryKeys';

import type { TPriceData } from '../model/prices';

export const priceQueryOptions = (get: TGet = clientGet) =>
  queryOptions({ queryKey: priceKeys.all, queryFn: async () => jsonOrThrow<TPriceData>(await get('/api/price')) });

export const usePriceQuery = () => useSuspenseQuery(priceQueryOptions());
