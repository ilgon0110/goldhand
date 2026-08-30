/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import {
  PHONE_AUTH_RECAPTCHA_CONTAINER_ID,
  PhoneAuthFields,
  usePhoneAuthVerifyFlow,
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
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const form = useForm<z.infer<typeof guestConfirmationSchema>>({
    resolver: zodResolver(guestConfirmationSchema),
    defaultValues: { phoneNumber: '', authCode: '', agreePersonalInfo: undefined },
    mode: 'onChange',
  });

  const agreePersonalInfo = form.watch('agreePersonalInfo');

  const phoneAuth = usePhoneAuthVerifyFlow(form, { phoneNumberName: 'phoneNumber', authCodeName: 'authCode' }, {
    onConfirmed: async result => {
      const phoneIdToken = await result.user.getIdToken();
      onConfirmed({ phoneNumber: form.getValues('phoneNumber'), phoneIdToken });
    },
  });

  return (
    <>
      <button
        aria-hidden="true"
        className="hidden"
        id={PHONE_AUTH_RECAPTCHA_CONTAINER_ID}
        key={phoneAuth.recaptchaKey}
        tabIndex={-1}
      />
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
            authCodeName="authCode"
            control={form.control}
            phoneAuth={phoneAuth}
            phoneNumberName="phoneNumber"
            restartLabel="번호 수정"
            sendDisabled={!agreePersonalInfo}
          />
          <p className="text-xs text-slate-500">동일한 대리점에는 24시간 내 1회만 후기를 작성할 수 있습니다.</p>
        </form>
      </Form>
      <PrivacyModal isOpen={isPrivacyModalOpen} setIsOpen={setIsPrivacyModalOpen} />
    </>
  );
};
