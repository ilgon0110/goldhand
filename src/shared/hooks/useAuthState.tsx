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
}

export function useAuthState() {
  const [authState, setAuthState] = useState<{
    isSignedIn: boolean;
    pending: boolean;
    user: User | null;
  }>({
    isSignedIn: false,
    pending: true,
    user: null,
  });
  const auth = getAuth(firebaseApp);
  const pathname = usePathname();

  useEffect(() => {
    const asyncFetch = async () => {
      try {
        const res = (await (
          await fetch(`/api/user`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            cache: 'no-store',
          })
        ).json()) as IResponseGetBody;
        if (res.response === 'ok') {
          setAuthState({
            isSignedIn: true,
            pending: false,
            user: res.userData ? auth.currentUser : null,
          });
        } else {
          setAuthState({
            isSignedIn: false,
            pending: false,
            user: null,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setAuthState({
          isSignedIn: false,
          pending: false,
          user: null,
        });
      }
    };

    asyncFetch();
  }, [pathname, auth.currentUser]);

  return { auth, ...authState };
}
