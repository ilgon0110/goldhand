import type { ConfirmationResult } from 'firebase/auth';
import {
  getAuth,
  linkWithCredential,
  PhoneAuthProvider,
  signInWithEmailAndPassword,
  updatePhoneNumber,
} from 'firebase/auth';
import { useRef, useState } from 'react';

import type { IUserDetailData } from '@/src/shared/types';

import type { IPhoneAuthError } from '../lib/toPhoneAuthError';
import { toPhoneAuthError } from '../lib/toPhoneAuthError';

/**
 * SMS 인증코드를 확인한 뒤, 현재 로그인된(이메일/OAuth) 계정에 전화번호를 연동한다.
 * SignUp 전용 - 로그인 세션이 없는 비회원 흐름에서는 사용하지 않는다.
 */
export const useLinkPhoneToCurrentUser = (
  userData: IUserDetailData | null,
  options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
  },
) => {
  const auth = getAuth();
  const [isPending, setIsPending] = useState(false);
  const [sendSmsConfirmSuccessMessage, setSmsConfirmSuccessMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const errorRef = useRef<IPhoneAuthError | null>(null);

  async function mutate(authCode: string, confirmationResult: ConfirmationResult | null) {
    setIsPending(true);

    if (!confirmationResult) {
      console.error('No confirmation result found.');
      setIsPending(false);
      return;
    }

    try {
      if (userData?.userId) {
        // 인증코드 확인 후, 전화번호를 현재 로그인된 계정에 연동
        try {
          // 1. 이메일 유저 로그인
          const emailUser = await signInWithEmailAndPassword(
            auth,
            userData?.email || '',
            process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!,
          );

          // 2. 전화번호 Credential 생성
          const phoneCredential = PhoneAuthProvider.credential(confirmationResult.verificationId, authCode);

          if (!emailUser) {
            throw new Error('이메일 유저 인증 정보가 없습니다. 다시 시도해주세요.');
          }

          // 3. 이메일 유저에 전화번호 연결
          const hasPhoneProvider = emailUser.user.providerData.some(provider => provider.providerId === 'phone');

          if (hasPhoneProvider) {
            await updatePhoneNumber(emailUser.user, phoneCredential);
          } else {
            await linkWithCredential(emailUser.user, phoneCredential);
          }

          setSmsConfirmSuccessMessage('인증코드가 확인되었습니다.');
          setIsSuccess(true);
          errorRef.current = null;
          options?.onSuccess?.();
        } catch (error: unknown) {
          console.error('Error linking phone number:', error);
          errorRef.current = toPhoneAuthError(error);
          options?.onError?.(error as Error);
        }
      }
    } catch (error: unknown) {
      console.error('Error confirming SMS code:', error);
      errorRef.current = toPhoneAuthError(error);
      options?.onError?.(error as Error);
    } finally {
      setIsPending(false);
      options?.onSettled?.();
    }
  }

  return {
    isSuccess,
    isPending,
    sendSmsConfirmSuccessMessage,
    mutate,
    getError: () => errorRef.current,
  };
};
