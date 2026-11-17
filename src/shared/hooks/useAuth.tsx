'use client';
import { useQuery } from '@tanstack/react-query';

import type { IUserResponseData } from '@/src/entities/user';

import { authKeys } from '../config/queryKeys';
import { fetcher } from '../utils/fetcher.client';

async function fetchAuth(): Promise<IUserResponseData> {
  return await fetcher<IUserResponseData>('/api/user', {
    credentials: 'include',
  });
}

export function useAuth() {
  return useQuery({
    queryKey: authKeys.all,
    queryFn: fetchAuth,
  });
}
