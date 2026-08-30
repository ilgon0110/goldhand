import type { UserCredential } from 'firebase/auth';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import { useConfirmPhoneAuthCode } from '../api/useConfirmPhoneAuthCode';
import { toPhoneAuthError } from '../lib/toPhoneAuthError';
import type { TPhoneAuthFlow } from './usePhoneAuthFlowCore';
import { usePhoneAuthFlowCore } from './usePhoneAuthFlowCore';

type TFieldNames<TFieldValues extends FieldValues> = {
  phoneNumberName: Path<TFieldValues>;
  authCodeName: Path<TFieldValues>;
};

/**
 * 계정 연동 없이 SMS 인증코드만 확인하는 흐름 (비회원 재인증: 후기 작성/삭제/수정).
 */
export function usePhoneAuthVerifyFlow<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  { phoneNumberName, authCodeName }: TFieldNames<TFieldValues>,
  options?: { onConfirmed?: (result: UserCredential) => Promise<unknown> | void },
): TPhoneAuthFlow {
  const confirm = useConfirmPhoneAuthCode({ onSuccess: options?.onConfirmed });

  return usePhoneAuthFlowCore(form, phoneNumberName, authCodeName, {
    isSuccess: confirm.isSuccess,
    isPending: confirm.isPending,
    sendSmsConfirmSuccessMessage: confirm.isSuccess ? '인증코드가 확인되었습니다.' : '',
    mutate: confirm.mutate,
    reset: confirm.reset,
    getError: () => {
      const error = confirm.getError();
      if (!error) return null;
      if (typeof error === 'object' && 'kind' in error && 'message' in error) {
        return error as ReturnType<typeof toPhoneAuthError>;
      }
      return toPhoneAuthError(error);
    },
  });
}
