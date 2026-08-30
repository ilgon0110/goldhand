import type { ConfirmationResult, UserCredential } from 'firebase/auth';
import { useRef, useState } from 'react';

/**
 * 계정 연동(linkWithCredential) 없이 SMS 인증코드만 확인한다.
 * 로그인 세션이 없는 비회원 흐름(예: 후기 작성)에서 사용한다.
 */
export const useConfirmPhoneAuthCode = (options?: {
  onSuccess?: (result: UserCredential) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
}) => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const errorMessageRef = useRef('');

  async function mutate(authCode: string, confirmationResult: ConfirmationResult | null) {
    setIsPending(true);

    if (!confirmationResult) {
      console.error('No confirmation result found.');
      setIsPending(false);
      return;
    }

    try {
      const result = await confirmationResult.confirm(authCode);
      setIsSuccess(true);
      errorMessageRef.current = '';
      options?.onSuccess?.(result);
    } catch (error: any) {
      console.error('Error confirming SMS code:', error);
      errorMessageRef.current = error.code || 'unknown-error';
      options?.onError?.(error as Error);
    } finally {
      setIsPending(false);
      options?.onSettled?.();
    }
  }

  function reset() {
    setIsSuccess(false);
    errorMessageRef.current = '';
  }

  return {
    isSuccess,
    isPending,
    mutate,
    reset,
    getErrorMessage: () => errorMessageRef.current,
  };
};
