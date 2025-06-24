'use client';

import type { User } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { firebaseApp } from '@/src/shared/config/firebase';

import type { IUserData } from '../types';

interface IResponseGetBody {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
  userData: IUserData['userData'] | null;
  isLinked: boolean;
}

export function useAuthState() {
  const [authState, setAuthState] = useState<{
    isSignedIn: boolean;
    pending: boolean;
    user: User | null;
    isLinked: boolean;
  }>({
    isSignedIn: false,
    pending: true,
    user: null,
    isLinked: false,
  });
  const auth = getAuth(firebaseApp);
  const pathname = usePathname();

  useEffect(() => {
    const asyncFetch = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'production'
            ? process.env.NEXT_PUBLIC_API_URL
            : process.env.NEXT_PUBLIC_LOCAL_API_URL;
        const res = (await (
          await fetch(`${apiUrl}/api/user`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            cache: 'no-store',
          })
        ).json()) as IResponseGetBody;
        console.log('useAuthState : res', res);
        if (res.response === 'ok') {
          setAuthState({
            isSignedIn: true,
            pending: false,
            user: res.userData ? auth.currentUser : null,
            isLinked: res.isLinked,
          });
        } else {
          setAuthState({
            isSignedIn: false,
            pending: false,
            user: null,
            isLinked: false,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setAuthState({
          isSignedIn: false,
          pending: false,
          user: null,
          isLinked: false,
        });
      }
    };

    asyncFetch();
  }, [pathname, auth.currentUser]);

  return { auth, ...authState };
}
