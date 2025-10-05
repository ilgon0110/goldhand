'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import type { IUserResponseData } from '../types';
import { fetcher } from '../utils/fetcher.client';

const defaultState = {
  isSignedIn: false,
  pending: true,
  userData: null,
  isLinked: false,
};

export function useAuthState() {
  const [authState, setAuthState] = useState<{
    isSignedIn: boolean;
    pending: boolean;
    userData: IUserResponseData['userData'] | null;
    isLinked: boolean;
  }>(defaultState);

  const pathname = usePathname();

  useEffect(() => {
    const asyncFetch = async () => {
      try {
        const res = await fetcher<IUserResponseData>(`/api/user`, {
          credentials: 'include',
          cache: 'no-store',
        });

        setAuthState({
          isSignedIn: res.response === 'ok',
          pending: false,
          userData: res.userData || null,
          isLinked: res.isLinked || false,
        });

        if (res.response === 'ok') {
          setAuthState({
            isSignedIn: true,
            pending: false,
            userData: res.userData,
            isLinked: res.isLinked,
          });
          return;
        }

        setAuthState({
          ...defaultState,
          pending: false,
        });
      } catch {
        setAuthState({
          ...defaultState,
          pending: false,
        });
      }
    };

    asyncFetch();
  }, [pathname]);

  return { ...authState };
}
