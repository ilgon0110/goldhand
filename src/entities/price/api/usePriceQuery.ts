import { useSuspenseQuery } from '@tanstack/react-query';

import { priceKeys } from '@/src/shared/config/queryKeys';

import { getPriceData } from './getPriceData';

export const usePriceQuery = () => useSuspenseQuery({ queryKey: priceKeys.all, queryFn: getPriceData });
