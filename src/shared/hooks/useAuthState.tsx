'use client';

import { getAuth } from 'firebase/auth';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { firebaseApp } from '@/src/shared/config/firebase';

import { apiUrl } from '../config';
import type { IUserResponseData } from '../types';

interface IResponseGetBody {
  response: 'ng' | 'ok' | 'unAuthorized';
  message: string;
  userData: IUserResponseData['userData'] | null;
  isLinked: boolean;
}

export function useAuthState() {
  const [authState, setAuthState] = useState<{
    isSignedIn: boolean;
    pending: boolean;
    userData: IUserResponseData['userData'] | null;
    isLinked: boolean;
  }>({
    isSignedIn: false,
    pending: true,
    userData: null,
    isLinked: false,
  });
  const auth = getAuth(firebaseApp);
  const pathname = usePathname();

  useEffect(() => {
    const asyncFetch = async () => {
      try {
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

        if (res.response === 'ok') {
          setAuthState({
            isSignedIn: true,
            pending: false,
            userData: res.userData,
            isLinked: res.isLinked,
          });
        } else {
          setAuthState({
            isSignedIn: false,
            pending: false,
            userData: null,
            isLinked: false,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setAuthState({
          isSignedIn: false,
          pending: false,
          userData: null,
          isLinked: false,
        });
      }
    };

    asyncFetch();
  }, [pathname]);

  return { ...authState };
}
