/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import type { ConfirmationResult } from 'firebase/auth';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import {
  PHONE_AUTH_RECAPTCHA_CONTAINER_ID,
  PhoneAuthFields,
  useConfirmPhoneAuthCode,
  usePhoneAuthCodeSendMutation,
} from '@/src/entities/phoneAuth/client';
import { guestConfirmationSchema } from '@/src/entities/review';
import { Checkbox } from '@/src/shared/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { PrivacyModal } from '@/src/widgets/Privacy/ui/PrivacyModal';

import type { TGuestVerification } from '../model';

type TGuestConfirmationStepProps = {
  onConfirmed: (verification: TGuestVerification) => void;
};

export const GuestConfirmationStep = ({ onConfirmed }: TGuestConfirmationStepProps) => {
  const [isAuthCodeOpen, setIsAuthCodeOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

  const form = useForm<z.infer<typeof guestConfirmationSchema>>({
    resolver: zodResolver(guestConfirmationSchema),
    defaultValues: { phoneNumber: '', authCode: '', agreePersonalInfo: undefined },
    mode: 'onChange',
  });

  const agreePersonalInfo = form.watch('agreePersonalInfo');
  const phoneNumberError = !!form.formState.errors.phoneNumber;
  const authCodeError = !!form.formState.errors.authCode;

  const {
    mutate: sendAuthCode,
    isPending: isSendingSms,
    sendSmsSuccessMessage,
    reset: resetSmsAuth,
  } = usePhoneAuthCodeSendMutation({
    onSuccess: result => {
      confirmationResultRef.current = result;
      setIsAuthCodeOpen(true);
    },
    onError: () => {
      form.setError('phoneNumber', {
        type: 'manual',
        message: '인증번호 발송에 실패했습니다. 다시 시도해주세요.',
      });
    },
  });

  const {
    isSuccess: authCodeSuccess,
    mutate: confirmAuthCode,
    isPending: isConfirming,
    getErrorMessage,
    reset: resetAuthConfirmation,
  } = useConfirmPhoneAuthCode({
    onSuccess: async result => {
      const phoneIdToken = await result.user.getIdToken();
      onConfirmed({ phoneNumber: form.getValues('phoneNumber'), phoneIdToken });
    },
  });

  const handleSendClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    sendAuthCode(form.getValues('phoneNumber'));
  };

  const handleConfirmClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (authCodeSuccess) return;

    await confirmAuthCode(form.getValues('authCode'), confirmationResultRef.current);

    const errorMessage = getErrorMessage();
    form.clearErrors('authCode');
    if (errorMessage === 'auth/invalid-verification-code') {
      form.setError('authCode', { type: 'manual', message: '인증코드가 일치하지 않습니다.' });
    } else if (errorMessage) {
      form.setError('authCode', { type: 'manual', message: '알 수 없는 오류가 발생했습니다.' });
    }
  };

  const handleRestartVerification = () => {
    confirmationResultRef.current = null;
    resetSmsAuth();
    resetAuthConfirmation();
    setIsAuthCodeOpen(false);
    form.reset();
  };

  return (
    <>
      <button aria-hidden="true" className="hidden" id={PHONE_AUTH_RECAPTCHA_CONTAINER_ID} tabIndex={-1} />
      <Form {...form}>
        <form className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">휴대폰 본인 인증</h2>
            <p className="text-sm text-slate-500">안전한 후기 작성을 위해 먼저 본인 인증을 진행해주세요.</p>
          </div>
          <FormField
            control={form.control}
            name="agreePersonalInfo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                <FormControl>
                  <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="font-normal">
                  개인정보 수집 및 이용에 동의합니다.{' '}
                  <button className="text-primary underline" type="button" onClick={() => setIsPrivacyModalOpen(true)}>
                    자세히 보기
                  </button>
                </FormLabel>
                <FormMessage>{form.formState.errors.agreePersonalInfo?.message}</FormMessage>
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
            restartLabel="번호 수정"
            sendDisabled={!agreePersonalInfo}
            sendSmsConfirmSuccessMessage={authCodeSuccess ? '인증코드가 확인되었습니다.' : ''}
            sendSmsSuccessMessage={sendSmsSuccessMessage}
            onConfirmClick={handleConfirmClick}
            onRestartClick={handleRestartVerification}
            onSendClick={handleSendClick}
          />
          <p className="text-xs text-slate-500">동일한 대리점에는 24시간 내 1회만 후기를 작성할 수 있습니다.</p>
        </form>
      </Form>
      <PrivacyModal isOpen={isPrivacyModalOpen} setIsOpen={setIsPrivacyModalOpen} />
    </>
  );
};
