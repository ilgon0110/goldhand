import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';

import type { IUserDetailData } from '@/src/shared/types';

import { useLinkPhoneToCurrentUser } from '../api/useLinkPhoneToCurrentUser';
import type { IPhoneAuthError } from '../lib/toPhoneAuthError';
import type { TPhoneAuthFlow } from './usePhoneAuthFlowCore';
import { usePhoneAuthFlowCore } from './usePhoneAuthFlowCore';

type TFieldNames<TFieldValues extends FieldValues> = {
  phoneNumberName: Path<TFieldValues>;
  authCodeName: Path<TFieldValues>;
};

/**
 * SMS 인증코드 확인 후 현재 로그인된 계정에 전화번호를 연동하는 흐름 (회원가입/핸드폰 연동).
 */
export function usePhoneAuthLinkFlow<TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>,
  { phoneNumberName, authCodeName }: TFieldNames<TFieldValues>,
  userData: IUserDetailData | null,
  options?: {
    onLinked?: () => void;
    onPhoneAlreadyInUse?: (error: IPhoneAuthError) => void;
    /** 성공 안내 문구를 기본값(`'인증코드가 확인되었습니다.'`) 대신 커스텀 문구로 표시하고 싶을 때 사용 */
    confirmedMessage?: string;
  },
): TPhoneAuthFlow {
  const link = useLinkPhoneToCurrentUser(userData, { onSuccess: options?.onLinked });

  const core = usePhoneAuthFlowCore(form, phoneNumberName, authCodeName, {
    isSuccess: link.isSuccess,
    isPending: link.isPending,
    sendSmsConfirmSuccessMessage:
      link.isSuccess && options?.confirmedMessage ? options.confirmedMessage : link.sendSmsConfirmSuccessMessage,
    mutate: link.mutate,
    reset: link.reset,
    getError: link.getError,
  });

  const onConfirmClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    await core.onConfirmClick(event);

    const error = link.getError();
    if (error?.kind === 'phone-already-in-use') {
      options?.onPhoneAlreadyInUse?.(error);
    }
  };

  return { ...core, onConfirmClick };
}
