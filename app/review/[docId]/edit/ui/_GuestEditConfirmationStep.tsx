/* eslint-disable react/jsx-handler-names */
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { phoneAuthFormSchema } from '@/src/entities/phoneAuth';
import type { IPhoneAuthError } from '@/src/entities/phoneAuth/client';
import {
  PHONE_AUTH_RECAPTCHA_CONTAINER_ID,
  PhoneAuthFields,
  usePhoneAuthVerifyFlow,
} from '@/src/entities/phoneAuth/client';
import { verifyGuestReviewOwner } from '@/src/entities/review';
import { Form } from '@/src/shared/ui/form';

export type TGuestEditVerification = {
  phoneIdToken: string;
  phoneNumber: string;
};

type TGuestEditConfirmationStepProps = {
  docId: string;
  onConfirmed: (verification: TGuestEditVerification) => void;
};

const OWNER_VERIFICATION_ERROR: IPhoneAuthError = {
  kind: 'unknown',
  message: '본인 확인에 실패했습니다. 입력 정보를 확인해주세요.',
};

export const GuestEditConfirmationStep = ({ docId, onConfirmed }: TGuestEditConfirmationStepProps) => {
  const form = useForm<z.infer<typeof phoneAuthFormSchema>>({
    resolver: zodResolver(phoneAuthFormSchema),
    defaultValues: { phoneNumber: '', authCode: '' },
    mode: 'onChange',
  });

  const phoneAuth = usePhoneAuthVerifyFlow(
    form,
    { phoneNumberName: 'phoneNumber', authCodeName: 'authCode' },
    {
      onConfirmed: async result => {
        const phoneIdToken = await result.user.getIdToken();
        try {
          await verifyGuestReviewOwner(docId, phoneIdToken);
          onConfirmed({ phoneNumber: form.getValues('phoneNumber'), phoneIdToken });
        } catch {
          return OWNER_VERIFICATION_ERROR;
        }
      },
    },
  );

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
            <p className="text-sm text-slate-500">작성 시 사용한 휴대폰번호로 본인 인증을 진행해주세요.</p>
          </div>
          <PhoneAuthFields
            authCodeName="authCode"
            control={form.control}
            phoneAuth={phoneAuth}
            phoneNumberName="phoneNumber"
            restartLabel="번호 수정"
          />
        </form>
      </Form>
    </>
  );
};
