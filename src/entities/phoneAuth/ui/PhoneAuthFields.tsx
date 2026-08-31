'use client';

import { Check } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { useFormState } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/src/shared/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { Input } from '@/src/shared/ui/input';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';

import type { TPhoneAuthFlow } from '../model/usePhoneAuthFlowCore';

type TPhoneAuthFieldsProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  phoneNumberName: Path<TFieldValues>;
  authCodeName: Path<TFieldValues>;
  phoneAuth: TPhoneAuthFlow;
  sendDisabled?: boolean;
  confirmSuccessLabel?: React.ReactNode;
  restartLabel?: React.ReactNode;
};

export function PhoneAuthFields<TFieldValues extends FieldValues>({
  control,
  phoneNumberName,
  authCodeName,
  phoneAuth,
  sendDisabled = false,
  confirmSuccessLabel = '인증완료',
  restartLabel = '다시 인증하기',
}: TPhoneAuthFieldsProps<TFieldValues>) {
  const authCodeInputRef = useRef<HTMLInputElement | null>(null);
  const { errors } = useFormState({ control, name: [phoneNumberName, authCodeName] });
  const phoneNumberError = !!errors[phoneNumberName];
  const authCodeError = !!errors[authCodeName];

  const {
    isAuthCodeOpen,
    isSendingSms,
    sendSmsSuccessMessage,
    isConfirming,
    authCodeSuccess,
    sendSmsConfirmSuccessMessage,
    onSendClick: handleSendClick,
    onConfirmClick: handleConfirmClick,
    onRestartClick: handleRestartClick,
  } = phoneAuth;
  const hasSentSms = sendSmsSuccessMessage !== '';

  useEffect(() => {
    if (hasSentSms && isAuthCodeOpen) {
      authCodeInputRef.current?.focus();
    }
  }, [hasSentSms, isAuthCodeOpen]);

  return (
    <>
      <FormField
        control={control}
        name={phoneNumberName}
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="phoneNumber">휴대폰번호</FormLabel>
            <FormControl>
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                <Input
                  disabled={hasSentSms}
                  id="phoneNumber"
                  placeholder="휴대폰번호를 입력해주세요. (예:01012345678)"
                  {...field}
                  maxLength={12}
                  minLength={6}
                  required
                />
                <div className="flex shrink-0 gap-2 [&>button]:flex-1 sm:[&>button]:flex-none">
                  <Button
                    aria-label={hasSentSms ? '인증번호 발송완료' : undefined}
                    className={cn(
                      'transition-all duration-300 ease-in-out',
                      (phoneNumberError || sendDisabled || isSendingSms || hasSentSms) &&
                        'cursor-not-allowed opacity-20',
                      hasSentSms && 'bg-green-500',
                    )}
                    disabled={phoneNumberError || sendDisabled || isSendingSms || hasSentSms}
                    type="button"
                    onClick={handleSendClick}
                  >
                    {isSendingSms ? <LoadingSpinnerIcon /> : hasSentSms ? <Check aria-hidden="true" /> : '인증받기'}
                  </Button>
                  {hasSentSms && (
                    <Button disabled={isConfirming} type="button" variant="outline" onClick={handleRestartClick}>
                      {restartLabel}
                    </Button>
                  )}
                </div>
              </div>
            </FormControl>
            <FormDescription>{sendSmsSuccessMessage}</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      {isAuthCodeOpen && (
        <FormField
          control={control}
          name={authCodeName}
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="authCode">인증코드</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
                  <Input
                    id="authCode"
                    placeholder="수신받은 인증코드를 입력해주세요."
                    {...field}
                    maxLength={6}
                    minLength={6}
                    ref={element => {
                      field.ref(element);
                      authCodeInputRef.current = element;
                    }}
                  />
                  <Button
                    aria-label={authCodeSuccess ? '인증완료' : undefined}
                    className={cn(
                      'transition-all duration-300 ease-in-out',
                      (authCodeError || isConfirming || authCodeSuccess) && 'cursor-not-allowed opacity-20',
                      sendSmsConfirmSuccessMessage && 'bg-green-500',
                      'sm:shrink-0',
                    )}
                    disabled={authCodeError || isConfirming || authCodeSuccess}
                    type="button"
                    onClick={handleConfirmClick}
                  >
                    {isConfirming ? <LoadingSpinnerIcon /> : authCodeSuccess ? confirmSuccessLabel : '인증하기'}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>{sendSmsConfirmSuccessMessage}</FormDescription>
              {(fieldState.isTouched || Boolean(field.value)) && <FormMessage />}
            </FormItem>
          )}
        />
      )}
    </>
  );
}
