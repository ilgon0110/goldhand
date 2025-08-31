'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { ConfirmationResult } from 'firebase/auth';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { firebaseApp } from '@/src/shared/config/firebase';
import { useAuthState } from '@/src/shared/hooks/useAuthState';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { toastError, toastSuccess } from '@/src/shared/utils';

import { signUpFormSchema } from '../config/signUpFormSchema';
import { useAuthCodeConfirmMutation } from '../hooks/useAuthCodeConfirmMutation';
import { usePhoneNumberConfirmMutation } from '../hooks/usePhoneNumberConfirmMutation';
import { useSignupMutation } from '../hooks/useSignupMutation';
//import { useRecaptcha } from '../hooks/useRecaptcha';

export const SignupPage = () => {
  const router = useRouter();
  const { userData } = useAuthState();
  const [isAuthCodeOpen, setIsAuthCodeOpen] = useState(false);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: userData?.name || '',
      nickname: userData?.nickname || '',
      phoneNumber: userData?.phoneNumber || '',
      email: userData?.email || '',
    },
    mode: 'onChange',
  });
  const formValidation = form.formState.isValid;
  const phoneNumberError = !!form.formState.errors.phoneNumber;
  const authCodeError = !!form.formState.errors.authCode;

  useEffect(() => {
    form.trigger();

    const auth = getAuth(firebaseApp);
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'sign-in-button', {
      size: 'invisible',
      callback: () => {},
      'expired-callback': () => {
        console.warn('reCAPTCHA expired, re-initializing');
        //initializeRecaptcha();
      },
    });
  }, []);

  // 1. 핸드폰 번호로 인증번호 발송 훅
  const {
    mutate,
    isPending: isSendingSms,
    sendSmsSuccessMessage,
  } = usePhoneNumberConfirmMutation({
    onSuccess: res => {
      confirmationResultRef.current = res;
    },
    onError: () => {
      form.setError('phoneNumber', {
        type: 'manual',
        message: '인증번호 발송에 실패했습니다. 다시 시도해주세요.',
      });
    },
  });

  const handleAuthClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setIsAuthCodeOpen(true);

    // 인증번호 발송 버튼 클릭 시
    mutate(form.getValues().phoneNumber);
  };

  // 2. 인증번호 검증 훅
  const {
    mutate: authCodeConfirmMutate,
    isPending: isConfirming,
    getErrorMessage,
    sendSmsConfirmSuccessMessage,
  } = useAuthCodeConfirmMutation(userData);

  const handleAuthConfirmClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // 항상 최상단에서 방지

    await authCodeConfirmMutate(form.getValues(), confirmationResultRef.current);

    const errorMessage = getErrorMessage();
    if (errorMessage === 'linking-failed') {
      form.setError('authCode', {
        type: 'manual',
        message: '이메일과 전화번호 연동에 실패했습니다. 처음부터 다시 시도해주세요.',
      });
    } else if (errorMessage === 'auth/invalid-verification-code') {
      form.setError('authCode', {
        type: 'manual',
        message: '인증코드가 일치하지 않습니다.',
      });
    } else if (errorMessage === 'auth/account-exists-with-different-credential') {
      form.setError('authCode', {
        type: 'manual',
        message: '이미 가입된 전화번호입니다.',
      });
      toastError(
        `이미 가입된 전화번호입니다.\n혹시 ${userData?.provider === 'kakao' ? '네이버' : '카카오'}로 가입하시지 않으셨나요?`,
      );
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } else if (errorMessage) {
      form.setError('authCode', {
        type: 'manual',
        message: errorMessage || '알 수 없는 오류가 발생했습니다.',
      });
    }
  };

  // 3. 회원가입 훅
  const { mutate: signup, isPending: isSubmitting } = useSignupMutation(form.getValues(), {
    onSuccess: () => {
      toastSuccess('회원가입 성공!\n잠시 후 메인 페이지로 이동합니다.');
      setTimeout(() => {
        router.replace('/');
      }, 3000);
    },
    onError: (error: Error) => {
      console.error('회원가입 중 오류 발생:', error);
      toastError(`회원가입 중 오류가 발생했습니다.\n${error.message}`);
      router.refresh();
    },
  });

  const onSubmit = async (_values: z.infer<typeof signUpFormSchema>) => {
    if (!formValidation) return;
    if (!!sendSmsConfirmSuccessMessage === false) return;

    signup();
  };

  return (
    <>
      <SectionTitle contents="회원가입을 위해 아래 정보를 입력해주세요" title="고운황금손 회원가입" />
      <button className="hidden" id="sign-in-button" />
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            defaultValue={userData?.name || ''}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input placeholder="이름을 입력하세요." {...field} required />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage>{form.formState.errors.name?.message}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            defaultValue={userData?.nickname || ''}
            name="nickname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>닉네임</FormLabel>
                <FormControl>
                  <Input placeholder="닉네임을 입력하세요." {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            defaultValue={userData?.phoneNumber || ''}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>휴대폰번호</FormLabel>
                <FormControl>
                  <div className="flex flex-row gap-6">
                    <Input
                      placeholder="휴대폰번호를 입력해주세요. (예:01012345678)"
                      {...field}
                      maxLength={12}
                      minLength={6}
                      required
                    />
                    <Button
                      className={cn(
                        'transition-all duration-300 ease-in-out',
                        phoneNumberError && 'cursor-not-allowed opacity-20',
                        sendSmsSuccessMessage && 'bg-green-500',
                      )}
                      disabled={phoneNumberError}
                      onClick={e => handleAuthClick(e)}
                    >
                      {isSendingSms ? (
                        <LoadingSpinnerIcon />
                      ) : sendSmsSuccessMessage != '' ? (
                        '인증번호 발송완료'
                      ) : (
                        '인증받기'
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormDescription>{sendSmsSuccessMessage}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {isAuthCodeOpen && (
            <FormField
              control={form.control}
              defaultValue={''}
              name="authCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>인증코드</FormLabel>
                  <FormControl>
                    <div className="flex flex-row gap-6">
                      <Input placeholder="수신받은 인증코드를 입력해주세요." {...field} maxLength={6} minLength={6} />
                      <Button
                        className={cn(
                          'transition-all duration-300 ease-in-out',
                          authCodeError && 'cursor-not-allowed opacity-20',
                          sendSmsConfirmSuccessMessage && 'bg-green-500',
                        )}
                        disabled={authCodeError}
                        onClick={e => handleAuthConfirmClick(e)}
                      >
                        {isConfirming ? (
                          <LoadingSpinnerIcon />
                        ) : sendSmsConfirmSuccessMessage != '' ? (
                          '인증완료'
                        ) : sendSmsConfirmSuccessMessage == '' ? (
                          '인증하기'
                        ) : (
                          '인증확인'
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>{sendSmsConfirmSuccessMessage}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            defaultValue={userData?.email || ''}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input placeholder="이메일을 입력해주세요." {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className={cn(
              'transition-all duration-300 ease-in-out',
              formValidation ? '' : 'cursor-not-allowed opacity-20',
            )}
            disabled={!formValidation}
            type="submit"
          >
            {isSubmitting ? (
              <LoadingSpinnerIcon />
            ) : userData ? (
              '회원정보 수정' // 이미 회원가입된 경우, 회원정보 수정으로 표시
            ) : (
              '회원가입'
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};
