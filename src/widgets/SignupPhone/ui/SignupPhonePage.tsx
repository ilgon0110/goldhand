'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { ConfirmationResult } from 'firebase/auth';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type z from 'zod';

import { cn } from '@/lib/utils';
import { phoneAuthFormSchema } from '@/src/entities/phoneAuth';
import {
  PHONE_AUTH_RECAPTCHA_CONTAINER_ID,
  PhoneAuthFields,
  useLinkPhoneToCurrentUser,
  usePhoneAuthCodeSendMutation,
  useRecaptcha,
} from '@/src/entities/phoneAuth/client';
import type { IUserDetailData } from '@/src/shared/types';
import { Button } from '@/src/shared/ui/button';
import { Form } from '@/src/shared/ui/form';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';
import SectionTitleHero from '@/src/shared/ui/SectionTitleHero';
import { toastError, toastSuccess } from '@/src/shared/utils';

import { useSignupPhoneMutation } from '../hooks/useSignupPhoneMutation';

interface ISignupPhonePageProps {
  userData: IUserDetailData | null;
}

export const SignupPhonePage = ({ userData }: ISignupPhonePageProps) => {
  const router = useRouter();
  const [isAuthCodeOpen, setIsAuthCodeOpen] = useState(false);
  const form = useForm<z.infer<typeof phoneAuthFormSchema>>({
    resolver: zodResolver(phoneAuthFormSchema),
    defaultValues: {
      phoneNumber: userData?.phoneNumber || '',
    },
    mode: 'onChange',
  });
  const formValidation = form.formState.isValid;
  const phoneNumberError = !!form.formState.errors.phoneNumber;
  const authCodeError = !!form.formState.errors.authCode;
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

  useRecaptcha(PHONE_AUTH_RECAPTCHA_CONTAINER_ID);

  useEffect(() => {
    form.trigger();
  }, [form]);

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
  } = useLinkPhoneToCurrentUser(userData);

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

  const onSubmit = async (_values: z.infer<typeof phoneAuthFormSchema>) => {
    if (!formValidation) return;
    if (!authCodeSuccess) return;

    signup();
  };

  return (
    <>
      <SectionTitleHero description="고운황금손 핸드폰인증을 진행합니다." label="고운황금손 핸드폰인증" />
      <button aria-hidden="true" className="hidden" id={PHONE_AUTH_RECAPTCHA_CONTAINER_ID} tabIndex={-1} />
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <PhoneAuthFields
            authCodeError={authCodeError}
            authCodeName="authCode"
            authCodeSuccess={authCodeSuccess}
            confirmSuccessLabel={<Check />}
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
