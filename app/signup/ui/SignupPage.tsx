'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { ConfirmationResult } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import {
  PHONE_AUTH_RECAPTCHA_CONTAINER_ID,
  PhoneAuthFields,
  useLinkPhoneToCurrentUser,
  usePhoneAuthCodeSendMutation,
  useRecaptcha,
} from '@/src/entities/phoneAuth/client';
import type { IUserDetailData } from '@/src/shared/types';
import { Button } from '@/src/shared/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { Input } from '@/src/shared/ui/input';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';
import { toastError, toastSuccess } from '@/src/shared/utils';

import { useSignupMutation } from '../api';
import { signUpFormSchema } from '../config';

interface ISignupPageProps {
  userData: IUserDetailData | null;
}

export const SignupPage = ({ userData }: ISignupPageProps) => {
  const router = useRouter();
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

  useRecaptcha(PHONE_AUTH_RECAPTCHA_CONTAINER_ID);

  useEffect(() => {
    form.trigger();
  }, [form]);

  // 1. 핸드폰 번호로 인증번호 발송 훅
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

  // 2. 인증번호 검증 훅
  const {
    isSuccess: authCodeSuccess,
    mutate: authCodeConfirmMutate,
    isPending: isConfirming,
    getErrorMessage,
    sendSmsConfirmSuccessMessage,
  } = useLinkPhoneToCurrentUser(userData);

  const handleAuthConfirmClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // 항상 최상단에서 방지

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

  // 3. 회원가입 훅
  const { mutate: signup, isPending: isSubmitting } = useSignupMutation(form.getValues(), {
    onSuccess: data => {
      if (data.response === 'ok') {
        toastSuccess('회원가입 성공!\n잠시 후 메인 페이지로 이동합니다.');
        setTimeout(() => {
          router.replace('/');
        }, 3000);
      } else {
        toastError(`회원가입에 실패했습니다.\n${data.message}`);
        router.refresh();
      }
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
      <SectionTitleHero description="회원가입을 위해 아래 정보를 입력해주세요" label="고운황금손 회원가입" />
      <button aria-hidden="true" className="hidden" id={PHONE_AUTH_RECAPTCHA_CONTAINER_ID} tabIndex={-1} />
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
          <PhoneAuthFields
            authCodeError={authCodeError}
            authCodeName="authCode"
            authCodeSuccess={authCodeSuccess}
            control={form.control}
            isAuthCodeOpen={isAuthCodeOpen}
            isConfirming={isConfirming}
            isSendingSms={isSendingSms}
            phoneNumberError={phoneNumberError}
            phoneNumberName="phoneNumber"
            sendSmsConfirmSuccessMessage={sendSmsConfirmSuccessMessage}
            sendSmsSuccessMessage={sendSmsSuccessMessage}
            onConfirmClick={handleAuthConfirmClick}
            onSendClick={handleAuthClick}
          />
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
            disabled={!formValidation || !authCodeSuccess}
            type="submit"
          >
            {isSubmitting ? <LoadingSpinnerIcon /> : '회원가입'}
          </Button>
        </form>
      </Form>
    </>
  );
};
