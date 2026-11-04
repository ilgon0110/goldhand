import { fetcher } from '@/src/shared/utils/fetcher.client';

import type { TPriceData } from '../model/prices';

export const getPriceData = () => fetcher<TPriceData>('/api/price', { cache: 'no-store' });
