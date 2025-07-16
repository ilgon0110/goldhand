'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  getAuth,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { linkWithCredential } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { firebaseApp } from '@/src/shared/config/firebase';
import type { IUserResponseData } from '@/src/shared/types';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { toastError, toastSuccess } from '@/src/shared/utils';

import { formSchema } from '../config/formSchema';
//import { useRecaptcha } from '../hooks/useRecaptcha';

export const SignupPage = ({ userData }: { userData: IUserResponseData }) => {
  const router = useRouter();
  const [isAuthCodeOpen, setIsAuthCodeOpen] = useState(false);
  const [sendSmsSuccessMessage, setSendSmsSuccessMessage] = useState('');
  const [SmsConfirmSuccessMessage, setSmsConfirmSuccessMessage] = useState('');
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = getAuth();
  const confirmationResultRef = useRef<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData?.userData?.name || '',
      nickname: userData?.userData?.nickname || '',
      phoneNumber: userData?.userData?.phoneNumber || '',
      email: userData?.userData?.email || '',
    },
    mode: 'onChange',
  });
  const formValidation = form.formState.isValid;
  const phoneNumberError = !!form.formState.errors.phoneNumber;
  const authCodeError = !!form.formState.errors.authCode;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!formValidation) return;
    if (!!SmsConfirmSuccessMessage === false) return;

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/signup', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...values }),
      });
      if (!res.ok) {
        throw new Error('회원가입 실패');
      }
      const result = await res.json();
      if (result.response === 'ok') {
        toastSuccess('회원가입 성공!\n잠시 후 메인 페이지로 이동합니다.');
        setTimeout(() => {
          router.replace('/');
        }, 3000);
      } else {
        toastError('회원가입 실패\n다시 시도해주세요.');
        setTimeout(() => {
          router.refresh();
        }, 3000);
      }
    } catch (error: any) {
      console.error('Error during form submission:', error);
      toastError(`회원가입 중 오류가 발생했습니다.\n${error.message}`);
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
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

  const handleSignInPhoneNumber = useCallback(
    async (phoneNumber: string) => {
      setIsSendingSms(true);

      phoneNumber = `+82${phoneNumber.substring(1)}`;
      try {
        if (typeof window === 'undefined') return;

        //reCAPTCHA 호출
        const appVerifier = window.recaptchaVerifier;
        if (!appVerifier) {
          throw new Error('RecaptchaVerifier is not initialized');
        }

        const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
        if (confirmationResult) {
          setSendSmsSuccessMessage('인증번호가 발송되었습니다.');
          confirmationResultRef.current = confirmationResult;
        }
      } catch (error) {
        console.error('Error during signInWithPhoneNumber:', error);
        form.setError('phoneNumber', {
          type: 'manual',
          message: '인증번호 발송에 실패했습니다. 다시 시도해주세요.',
        });

        //initializeRecaptcha();
      } finally {
        setIsSendingSms(false);
      }
    },
    [form],
  );

  const handleAuthClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setIsAuthCodeOpen(true);
    // 인증번호 발송 버튼 클릭 시
    handleSignInPhoneNumber(form.getValues().phoneNumber);
  };

  const handleAuthConfirmClick = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault(); // 항상 최상단에서 방지
      setIsConfirming(true);

      const authCode = form.getValues().authCode;
      const confirmationResult = confirmationResultRef.current;

      if (!confirmationResult) {
        console.error('No confirmation result found.');
        return;
      }

      try {
        if (userData.userData) {
          // 인증코드 확인 후, 전화번호를 현재 로그인된 계정에 연결
          try {
            // ✅ 1. 이메일 유저 로그인
            const emailUser = await signInWithEmailAndPassword(
              auth,
              userData.userData?.email || '',
              process.env.NEXT_PUBLIC_DEFAULT_PASSWORD!,
            );

            // ✅ 2. 전화번호 Credential 생성
            const phoneCredential = PhoneAuthProvider.credential(confirmationResult.verificationId, authCode);

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
            form.setError('authCode', {
              type: 'manual',
              message: '이메일과 전화번호 연동에 실패했습니다. 처음부터 다시 시도해주세요.',
            });
          }
        }
      } catch (error: any) {
        console.error('Error confirming SMS code:', error);
        if (error.code === 'auth/invalid-verification-code') {
          form.setError('authCode', {
            type: 'manual',
            message: '인증코드가 일치하지 않습니다.',
          });
        } else {
          form.setError('authCode', {
            type: 'manual',
            message: '알 수 없는 오류가 발생했습니다.',
          });
        }
      } finally {
        setIsConfirming(false);
      }
    },
    [form, confirmationResultRef],
  );

  useEffect(() => {
    form.trigger();
  }, []);

  return (
    <div>
      <SectionTitle buttonTitle="" title="고운황금손 회원가입" onClickButtonTitle={() => {}} />
      <button className="hidden" id="sign-in-button" />
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            defaultValue={userData?.userData?.name || ''}
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
            defaultValue={userData?.userData?.nickname || ''}
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
            defaultValue={userData?.userData?.phoneNumber || ''}
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
                          SmsConfirmSuccessMessage && 'bg-green-500',
                        )}
                        disabled={authCodeError}
                        onClick={e => handleAuthConfirmClick(e)}
                      >
                        {isConfirming ? (
                          <LoadingSpinnerIcon />
                        ) : SmsConfirmSuccessMessage != '' ? (
                          '인증완료'
                        ) : SmsConfirmSuccessMessage == '' ? (
                          '인증하기'
                        ) : (
                          '인증확인'
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>{SmsConfirmSuccessMessage}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            defaultValue={userData?.userData?.email || ''}
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
            ) : userData.userData ? (
              '회원정보 수정' // 이미 회원가입된 경우, 회원정보 수정으로 표시
            ) : (
              '회원가입'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
