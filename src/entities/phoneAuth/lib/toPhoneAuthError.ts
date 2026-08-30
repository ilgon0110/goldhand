export type TPhoneAuthErrorKind =
  | 'expired-code'
  | 'invalid-code'
  | 'linking-failed'
  | 'network'
  | 'phone-already-in-use'
  | 'too-many-requests'
  | 'unknown';

export interface IPhoneAuthError {
  kind: TPhoneAuthErrorKind;
  message: string;
}

function getErrorCode(error: unknown): string | null {
  if (typeof error === 'string') {
    return error || null;
  }

  if (error != null && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
    return error.code;
  }

  return null;
}

/**
 * Firebase 에러 객체({ code })와 raw Firebase 에러 코드 문자열(예: useConfirmPhoneAuthCode가
 * 반환하는 값) 양쪽 모두를 사용자용 에러로 변환한다. 계정 연동(link) 흐름과 재인증(verify)
 * 흐름이 같은 코드 체계를 공유하므로 하나의 매핑으로 통합했다.
 */
export function toPhoneAuthError(error: unknown): IPhoneAuthError {
  switch (getErrorCode(error)) {
    case 'auth/invalid-verification-code':
    case 'auth/invalid-credential':
      return { kind: 'invalid-code', message: '인증코드가 틀렸습니다.' };
    case 'auth/code-expired':
    case 'auth/session-expired':
      return { kind: 'expired-code', message: '인증 시간이 만료되었습니다. 인증번호를 다시 받아주세요.' };
    case 'auth/account-exists-with-different-credential':
    case 'auth/credential-already-in-use':
      return { kind: 'phone-already-in-use', message: '이미 다른 계정에서 사용 중인 휴대폰 번호입니다.' };
    case 'auth/too-many-requests':
    case 'auth/quota-exceeded':
      return { kind: 'too-many-requests', message: '인증 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' };
    case 'auth/network-request-failed':
      return { kind: 'network', message: '네트워크 연결을 확인한 후 다시 시도해주세요.' };
    case null:
      return {
        kind: 'linking-failed',
        message: '이메일과 전화번호 연동에 실패했습니다. 처음부터 다시 시도해주세요.',
      };
    default:
      return { kind: 'unknown', message: '휴대폰 인증 중 오류가 발생했습니다. 다시 시도해주세요.' };
  }
}
