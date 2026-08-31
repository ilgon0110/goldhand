import type { ConfirmationResult, UserCredential } from 'firebase/auth';
import { useRef, useState } from 'react';

import type { IPhoneAuthError } from '../lib/toPhoneAuthError';

function isPhoneAuthError(error: unknown): error is IPhoneAuthError {
  return (
    error != null &&
    typeof error === 'object' &&
    'kind' in error &&
    typeof error.kind === 'string' &&
    'message' in error &&
    typeof error.message === 'string'
  );
}

/**
 * 계정 연동(linkWithCredential) 없이 SMS 인증코드만 확인한다.
 * 로그인 세션이 없는 비회원 흐름(예: 후기 작성)에서 사용한다.
 */
export const useConfirmPhoneAuthCode = (options?: {
  onSuccess?: (result: UserCredential) => Promise<unknown> | void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}) => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const errorRef = useRef<unknown>(null);

  async function mutate(authCode: string, confirmationResult: ConfirmationResult | null) {
    setIsPending(true);

    if (!confirmationResult) {
      console.error('No confirmation result found.');
      setIsPending(false);
      return;
    }

    try {
      const result = await confirmationResult.confirm(authCode);
      const postConfirmationError = await options?.onSuccess?.(result);
      if (isPhoneAuthError(postConfirmationError)) {
        errorRef.current = postConfirmationError;
        return;
      }
      setIsSuccess(true);
      errorRef.current = null;
    } catch (error: unknown) {
      console.error('Error confirming SMS code:', error);
      errorRef.current = error;
      options?.onError?.(error instanceof Error ? error : new Error('Unknown phone authentication error'));
    } finally {
      setIsPending(false);
      options?.onSettled?.();
    }
  }

  function reset() {
    setIsSuccess(false);
    errorRef.current = null;
  }

  return {
    isSuccess,
    isPending,
    mutate,
    reset,
    getError: () => errorRef.current,
  };
};
