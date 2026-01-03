import type { ConfirmationResult } from 'firebase/auth';
import { getAuth, signInWithPhoneNumber } from 'firebase/auth';
import { useState } from 'react';

export const usePhoneNumberConfirmMutation = (options?: {
  onSuccess?: (res: ConfirmationResult) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}) => {
  const auth = getAuth();
  const [isPending, setIsPending] = useState(false);
  const [sendSmsSuccessMessage, setSendSmsSuccessMessage] = useState('');

  async function mutate(phoneNumber: string) {
    setIsPending(true);

    phoneNumber = `+82${phoneNumber.substring(1)}`;
    try {
      if (typeof window === 'undefined') return;

      //reCAPTCHA 호출
      const appVerifier = window.recaptchaVerifier;
      if (!appVerifier) {
        throw new Error('RecaptchaVerifier is not initialized');
      }

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

  return {
    isPending,
    sendSmsSuccessMessage,
    mutate,
  };
};
