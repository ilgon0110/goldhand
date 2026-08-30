import type { ConfirmationResult } from 'firebase/auth';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';

import { firebaseApp } from '@/src/shared/config/firebase';

export const PHONE_AUTH_RECAPTCHA_CONTAINER_ID = 'phone-auth-recaptcha-container';

function createRecaptchaVerifier(): RecaptchaVerifier {
  if (typeof window === 'undefined') {
    throw new Error('reCAPTCHA는 브라우저 환경에서만 초기화할 수 있습니다.');
  }

  const auth = getAuth(firebaseApp);
  auth.languageCode = 'ko';

  return new RecaptchaVerifier(auth, PHONE_AUTH_RECAPTCHA_CONTAINER_ID, {
    size: 'invisible',
    callback: () => {},
    'expired-callback': () => {
      console.warn('reCAPTCHA expired.');
    },
  });
}

export const usePhoneAuthCodeSendMutation = (options?: {
  onSuccess?: (res: ConfirmationResult) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}) => {
  const auth = getAuth();
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [sendSmsSuccessMessage, setSendSmsSuccessMessage] = useState('');

  useEffect(() => {
    return () => {
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
    };
  }, []);

  async function mutate(phoneNumber: string) {
    setIsPending(true);

    phoneNumber = `+82${phoneNumber.substring(1)}`;
    try {
      // reCAPTCHA는 실제로 SMS를 보내는 이 시점에 lazy하게 생성/재사용한다.
      const appVerifier = recaptchaVerifierRef.current ?? createRecaptchaVerifier();
      recaptchaVerifierRef.current = appVerifier;

      const res = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);

      if (res) {
        setSendSmsSuccessMessage('인증번호가 발송되었습니다.');
        options?.onSuccess?.(res);
      }
    } catch (error) {
      options?.onError?.(error as Error);
      console.error('Error during signInWithPhoneNumber:', error);
    } finally {
      options?.onSettled?.();
      setIsPending(false);
    }
  }

  function reset() {
    recaptchaVerifierRef.current?.clear();
    recaptchaVerifierRef.current = null;
    setSendSmsSuccessMessage('');
  }

  return {
    isPending,
    sendSmsSuccessMessage,
    mutate,
    reset,
  };
};
