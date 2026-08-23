'use client';

import type { Control, FieldValues, Path } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/src/shared/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/src/shared/ui/form';
import { Input } from '@/src/shared/ui/input';
import { LoadingSpinnerIcon } from '@/src/shared/ui/loadingSpinnerIcon';

type TPhoneAuthFieldsProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  phoneNumberName: Path<TFieldValues>;
  authCodeName: Path<TFieldValues>;
  isAuthCodeOpen: boolean;
  phoneNumberError: boolean;
  authCodeError: boolean;
  isSendingSms: boolean;
  sendSmsSuccessMessage: string;
  onSendClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isConfirming: boolean;
  authCodeSuccess: boolean;
  sendSmsConfirmSuccessMessage: string;
  onConfirmClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  confirmSuccessLabel?: React.ReactNode;
};

export function PhoneAuthFields<TFieldValues extends FieldValues>({
  control,
  phoneNumberName,
  authCodeName,
  isAuthCodeOpen,
  phoneNumberError,
  authCodeError,
  isSendingSms,
  sendSmsSuccessMessage,
  onSendClick: handleSendClick,
  isConfirming,
  authCodeSuccess,
  sendSmsConfirmSuccessMessage,
  onConfirmClick: handleConfirmClick,
  confirmSuccessLabel = '인증완료',
}: TPhoneAuthFieldsProps<TFieldValues>) {
  return (
    <>
      <FormField
        control={control}
        name={phoneNumberName}
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
                  onClick={handleSendClick}
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
          control={control}
          name={authCodeName}
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
                    onClick={handleConfirmClick}
                  >
                    {isConfirming ? <LoadingSpinnerIcon /> : authCodeSuccess ? confirmSuccessLabel : '인증하기'}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>{sendSmsConfirmSuccessMessage}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </>
  );
}
