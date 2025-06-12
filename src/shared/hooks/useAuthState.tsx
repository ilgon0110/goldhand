import type { User } from 'firebase/auth';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { firebaseApp } from '@/src/shared/config/firebase';

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

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setAuthState({ user, pending: false, isSignedIn: true });
      } else {
        setAuthState({ user: null, pending: false, isSignedIn: false });
      }
    });
  }, []);

  return { auth, ...authState };
}
