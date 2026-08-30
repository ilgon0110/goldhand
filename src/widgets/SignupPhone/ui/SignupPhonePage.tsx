'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type z from 'zod';

import { cn } from '@/lib/utils';
import { phoneAuthFormSchema } from '@/src/entities/phoneAuth';
import {
  PHONE_AUTH_RECAPTCHA_CONTAINER_ID,
  PhoneAuthFields,
  usePhoneAuthLinkFlow,
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
  const form = useForm<z.infer<typeof phoneAuthFormSchema>>({
    resolver: zodResolver(phoneAuthFormSchema),
    defaultValues: {
      phoneNumber: userData?.phoneNumber || '',
    },
    mode: 'onChange',
  });
  const formValidation = form.formState.isValid;

  useEffect(() => {
    form.trigger();
  }, [form]);

  const phoneAuth = usePhoneAuthLinkFlow(
    form,
    { phoneNumberName: 'phoneNumber', authCodeName: 'authCode' },
    userData,
    {
      confirmedMessage: '인증코드가 확인되었습니다. 아래의 인증 완료하기 버튼을 클릭해주세요.',
      onPhoneAlreadyInUse: () => {
        toastError(
          `이미 가입된 전화번호입니다.\n혹시 ${userData?.provider === 'kakao' ? '네이버' : '카카오'}로 가입하시지 않으셨나요?`,
        );
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      },
    },
  );

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
    if (!phoneAuth.authCodeSuccess) return;

    signup();
  };

  return (
    <>
      <SectionTitleHero description="고운황금손 핸드폰인증을 진행합니다." label="고운황금손 핸드폰인증" />
      <button
        aria-hidden="true"
        className="hidden"
        id={PHONE_AUTH_RECAPTCHA_CONTAINER_ID}
        key={phoneAuth.recaptchaKey}
        tabIndex={-1}
      />
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <PhoneAuthFields
            authCodeName="authCode"
            confirmSuccessLabel={<Check />}
            control={form.control}
            phoneAuth={phoneAuth}
            phoneNumberName="phoneNumber"
          />
          <Button
            className={cn(
              'transition-all duration-300 ease-in-out',
              formValidation ? '' : 'cursor-not-allowed opacity-20',
            )}
            disabled={!formValidation || !phoneAuth.authCodeSuccess}
            type="submit"
          >
            {isSubmitting ? <LoadingSpinnerIcon /> : '인증 완료하기'}
          </Button>
        </form>
      </Form>
    </>
  );
};
