'use client';
import { useEffect } from 'react';

import { apiUrl } from '@/src/shared/config';
import { useAuthStore } from '@/src/shared/store';

export const useAuthInit = () => {
  const { accessToken, setAccessToken, setHydrated } = useAuthStore();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/auth/header`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          setAccessToken(data.accessToken ?? null);
        }
      } catch (err) {
        console.error('Failed to fetch token:', err);
        setAccessToken(null);
      } finally {
        setHydrated(true);
      }
    };

    fetchToken();
  }, [accessToken]);
};
