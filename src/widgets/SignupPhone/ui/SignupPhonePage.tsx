'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { ConfirmationResult } from 'firebase/auth';
import { getAuth, RecaptchaVerifier } from 'firebase/auth';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type z from 'zod';

import { cn } from '@/lib/utils';
import { firebaseApp } from '@/src/shared/config/firebase';
import type { IUserDetailData } from '@/src/shared/types';
import { Button } from '@/src/shared/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { Input } from '@/src/shared/ui/input';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import { SectionTitle } from '@/src/shared/ui/sectionTitle';
import { toastError, toastSuccess } from '@/src/shared/utils';

import { signupPhoneFormSchema } from '../config/signupPhoneFormSchema';
import { usePhoneAuthCodeConfirmMutation } from '../hooks/usePhoneAuthCodeConfirmMutation';
import { usePhoneAuthCodeSendMutation } from '../hooks/usePhoneAuthCodeSendMutation';
import { useSignupPhoneMutation } from '../hooks/useSignupPhoneMutation';

interface ISignupPhonePageProps {
  userData: IUserDetailData | null;
}

export const SignupPhonePage = ({ userData }: ISignupPhonePageProps) => {
  const router = useRouter();
  const [isAuthCodeOpen, setIsAuthCodeOpen] = useState(false);
  const form = useForm<z.infer<typeof signupPhoneFormSchema>>({
    resolver: zodResolver(signupPhoneFormSchema),
    defaultValues: {
      phoneNumber: userData?.phoneNumber || '',
    },
    mode: 'onChange',
  });
  const formValidation = form.formState.isValid;
  const phoneNumberError = !!form.formState.errors.phoneNumber;
  const authCodeError = !!form.formState.errors.authCode;
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

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

  const {
    mutate,
    isPending: isSendingSms,
    sendSmsSuccessMessage,
  } = usePhoneAuthCodeSendMutation({
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

  const {
    isSuccess: authCodeSuccess,
    mutate: authCodeConfirmMutate,
    isPending: isConfirming,
    getErrorMessage,
    sendSmsConfirmSuccessMessage,
  } = usePhoneAuthCodeConfirmMutation(userData);

  const handleAuthConfirmClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // 항상 최상단에서 방지
    if (authCodeSuccess) return; // 이미 인증된 경우 무시
    await authCodeConfirmMutate(form.getValues('authCode'), confirmationResultRef.current);

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

  const { mutate: signup, isPending: isSubmitting } = useSignupPhoneMutation(form.getValues(), {
    onSuccess: data => {
      if (data.response === 'ok') {
        toastSuccess('핸드폰인증 성공!\n잠시 후 메인 페이지로 이동합니다.');
        setTimeout(() => {
          router.replace('/');
        }, 3000);
      } else {
        toastError(`핸드폰인증에 실패했습니다.\n${data.message}`);
        router.refresh();
      }
    },
    onError: (error: Error) => {
      console.error('핸드폰인증 중 오류 발생:', error);
      toastError(`핸드폰인증 중 오류가 발생했습니다.\n${error.message}`);
      router.refresh();
    },
  });

  const onSubmit = async (_values: z.infer<typeof signupPhoneFormSchema>) => {
    if (!formValidation) return;
    if (!authCodeSuccess) return;

    signup();
  };

  return (
    <>
      <SectionTitle title="고운황금손 핸드폰인증" />
      <button className="hidden" id="sign-in-button" />
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            defaultValue={userData?.phoneNumber || ''}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="phoneNumber">휴대폰번호</FormLabel>
                <FormControl>
                  <div className="flex flex-row gap-6">
                    <Input
                      id="phoneNumber"
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
                  <FormLabel htmlFor="authCode">인증코드</FormLabel>
                  <FormControl>
                    <div className="flex flex-row gap-6">
                      <Input
                        id="authCode"
                        placeholder="수신받은 인증코드를 입력해주세요."
                        {...field}
                        maxLength={6}
                        minLength={6}
                      />
                      <Button
                        className={cn(
                          'transition-all duration-300 ease-in-out',
                          authCodeError && 'cursor-not-allowed opacity-20',
                          sendSmsConfirmSuccessMessage && 'bg-green-500',
                        )}
                        disabled={authCodeError}
                        onClick={e => handleAuthConfirmClick(e)}
                      >
                        {isConfirming ? <LoadingSpinnerIcon /> : authCodeSuccess ? <Check /> : '인증하기'}
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>{sendSmsConfirmSuccessMessage}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button
            className={cn(
              'transition-all duration-300 ease-in-out',
              formValidation ? '' : 'cursor-not-allowed opacity-20',
            )}
            disabled={!formValidation || !authCodeSuccess}
            type="submit"
          >
            {isSubmitting ? <LoadingSpinnerIcon /> : '인증 완료하기'}
          </Button>
        </form>
      </Form>
    </>
  );
};
