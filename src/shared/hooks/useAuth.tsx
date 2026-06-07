'use client';
import { useQuery } from '@tanstack/react-query';

import { authKeys } from '../config/queryKeys';
import type { IUserResponseData } from '../types';
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
