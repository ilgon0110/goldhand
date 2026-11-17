import type { ConfirmationResult } from 'firebase/auth';
import { useRef, useState } from 'react';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import { usePhoneAuthCodeSendMutation } from '../api/usePhoneAuthCodeSendMutation';
import type { IPhoneAuthError } from '../lib/toPhoneAuthError';

export type TPhoneAuthFlow = {
  isAuthCodeOpen: boolean;
  isSendingSms: boolean;
  sendSmsSuccessMessage: string;
  /** reCAPTCHA 컨테이너 엘리먼트의 React key. reset() 시마다 바뀌어 재마운트를 강제한다. */
  recaptchaKey: number;
  isConfirming: boolean;
  authCodeSuccess: boolean;
  sendSmsConfirmSuccessMessage: string;
  onSendClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onConfirmClick: (event: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  onRestartClick: () => void;
};

export type TConfirmAdapter = {
  isSuccess: boolean;
  isPending: boolean;
  sendSmsConfirmSuccessMessage: string;
  mutate: (authCode: string, confirmationResult: ConfirmationResult | null) => Promise<void>;
  reset: () => void;
  getError: () => IPhoneAuthError | null;
};

/**
 * SMS 발송 + 인증코드 확인 흐름의 공통 오케스트레이션.
 * confirm 어댑터만 바뀌면 계정 연동(link) 흐름과 재인증(verify) 흐름 양쪽에 재사용된다.
 */
export function usePhoneAuthFlowCore<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  phoneNumberName: Path<TFieldValues>,
  authCodeName: Path<TFieldValues>,
  confirm: TConfirmAdapter,
): TPhoneAuthFlow {
  const [isAuthCodeOpen, setIsAuthCodeOpen] = useState(false);
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);

  const sendMutation = usePhoneAuthCodeSendMutation({
    onSuccess: result => {
      confirmationResultRef.current = result;
      setIsAuthCodeOpen(true);
    },
    onError: () => {
      form.setError(phoneNumberName, {
        type: 'manual',
        message: '인증번호 발송에 실패했습니다. 다시 시도해주세요.',
      });
    },
  });

  const onSendClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    sendMutation.mutate(form.getValues(phoneNumberName));
  };

  const onConfirmClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (confirm.isSuccess) return;

    await confirm.mutate(form.getValues(authCodeName), confirmationResultRef.current);

    form.clearErrors(authCodeName);
    const error = confirm.getError();
    if (error) {
      form.setError(authCodeName, { type: 'manual', message: error.message });
    }
  };

  const onRestartClick = () => {
    confirmationResultRef.current = null;
    sendMutation.reset();
    confirm.reset();
    setIsAuthCodeOpen(false);
    form.reset();
  };

  return {
    isAuthCodeOpen,
    isSendingSms: sendMutation.isPending,
    sendSmsSuccessMessage: sendMutation.sendSmsSuccessMessage,
    recaptchaKey: sendMutation.recaptchaKey,
    isConfirming: confirm.isPending,
    authCodeSuccess: confirm.isSuccess,
    sendSmsConfirmSuccessMessage: confirm.sendSmsConfirmSuccessMessage,
    onSendClick,
    onConfirmClick,
    onRestartClick,
  };
}
