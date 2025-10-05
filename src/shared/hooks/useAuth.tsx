'use client';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';

import type { IUserResponseData } from '../types';
import { fetcher } from '../utils/fetcher.client';

interface IAuthState {
  isSignedIn: boolean;
  pending: boolean;
  userData: IUserResponseData['userData'] | null;
  isLinked: boolean;
}
async function fetchAuth(): Promise<IAuthState> {
  const res = await fetcher<IUserResponseData>('/api/user', {
    credentials: 'include',
    cache: 'no-store',
  });

  return {
    isSignedIn: res.response === 'ok',
    pending: false,
    userData: res.userData || null,
    isLinked: res.isLinked || false,
  };
}

export function useAuth() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = useQuery({
    queryKey: ['auth', pathname, searchParams.toString()],
    queryFn: fetchAuth,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: false,
  });

  if (query.isLoading) {
    return { isSignedIn: false, pending: true, userData: null, isLinked: false };
  }
  if (query.isError || query.data == null) {
    return { isSignedIn: false, pending: false, userData: null, isLinked: false };
  }
  return query.data;
}
