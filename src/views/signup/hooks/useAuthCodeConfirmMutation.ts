import type { ConfirmationResult } from 'firebase/auth';
import { getAuth, linkWithCredential, PhoneAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { useRef, useState } from 'react';
import type z from 'zod';

import type { IUserDetailData } from '@/src/shared/types';

import type { signUpFormSchema } from '../config/signUpFormSchema';

export const useAuthCodeConfirmMutation = (
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
  const errorMessageRef = useRef('');

  async function mutate(values: z.infer<typeof signUpFormSchema>, confirmationResult: ConfirmationResult | null) {
    setIsPending(true);

    if (!confirmationResult) {
      console.error('No confirmation result found.');
      return;
    }

    try {
      if (userData?.userId) {
        // 인증코드 확인 후, 전화번호를 현재 로그인된 계정에 연동
        try {
          // ✅ 1. 이메일 유저 로그인
          const emailUser = await signInWithEmailAndPassword(
            auth,
            userData?.email || '',
            process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!,
          );

          // ✅ 2. 전화번호 Credential 생성
          const phoneCredential = PhoneAuthProvider.credential(confirmationResult.verificationId, values.authCode);

          if (!emailUser) {
            throw new Error('이메일 유저 인증 정보가 없습니다. 다시 시도해주세요.');
          }

          // ✅ 3. 이메일 유저에 전화번호 연결
          const linkedResult = await linkWithCredential(emailUser.user, phoneCredential);
          if (linkedResult) {
            setSmsConfirmSuccessMessage('인증코드가 확인되었습니다.');
          }
        } catch (error: any) {
          console.error('Error linking phone number:', error);
          errorMessageRef.current = error.code || 'linking-failed';
          options?.onError?.(error as Error);
          //   form.setError('authCode', {
          //     type: 'manual',
          //     message: '이메일과 전화번호 연동에 실패했습니다. 처음부터 다시 시도해주세요.',
          //   });
        }
      }
    } catch (error: any) {
      console.error('Error confirming SMS code:', error);
      errorMessageRef.current = error.code || 'unknown-error';
      options?.onError?.(error as Error);
      // if (error.code === 'auth/invalid-verification-code') {
      //   setErrorMessage('auth/invalid-verification-code');
      // } else if(error.code === 'auth/account-exists-with-different-credential') {

      // }
      // else {
      //   setErrorMessage(error.code || 'unknown-error');
      //   options?.onError?.(error as Error);
      //   // form.setError('authCode', {
      //   //   type: 'manual',
      //   //   message: '알 수 없는 오류가 발생했습니다.',
      //   // });
      // }
    } finally {
      setIsPending(false);
      options?.onSettled?.();
    }
  }

  return {
    isPending,
    sendSmsConfirmSuccessMessage,
    mutate,
    getErrorMessage: () => errorMessageRef.current,
  };
};
