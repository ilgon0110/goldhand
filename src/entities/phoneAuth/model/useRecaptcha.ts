/* eslint-disable @typescript-eslint/naming-convention */
'use client';

import type { ConfirmationResult } from 'firebase/auth';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
import { useCallback, useEffect, useRef } from 'react';

import { firebaseApp } from '@/src/shared/config/firebase';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
    confirmationResult: ConfirmationResult;
  }
}

export const PHONE_AUTH_RECAPTCHA_CONTAINER_ID = 'phone-auth-recaptcha-container';

export function useRecaptcha(containerId: string = PHONE_AUTH_RECAPTCHA_CONTAINER_ID) {
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  const initializeRecaptcha = useCallback(() => {
    const auth = getAuth(firebaseApp);
    auth.languageCode = 'ko';
    if (typeof window === 'undefined') return;

    if (!window.recaptchaVerifier) {
      try {
        const verifier = new RecaptchaVerifier(auth, containerId, {
          size: 'invisible',
          callback: (_response: string) => {},
          'expired-callback': () => {
            console.warn('reCAPTCHA expired. Resetting...');
            verifier.clear();
          },
        });

        verifier.render().then(_widgetId => {});

        window.recaptchaVerifier = verifier;
        recaptchaRef.current = verifier;
      } catch (error) {
        console.error('reCAPTCHA initialization error:', error);
      }
    }
  }, [containerId]);

  useEffect(() => {
    initializeRecaptcha();

    return () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  return { initializeRecaptcha };
}
