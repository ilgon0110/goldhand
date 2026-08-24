import { toPhoneAuthError } from '@/src/entities/phoneAuth/lib/toPhoneAuthError';

describe('toPhoneAuthError', () => {
  it.each([
    ['auth/invalid-verification-code', 'invalid-code', '인증코드가 틀렸습니다.'],
    ['auth/invalid-credential', 'invalid-code', '인증코드가 틀렸습니다.'],
    ['auth/code-expired', 'expired-code', '인증 시간이 만료되었습니다. 인증번호를 다시 받아주세요.'],
    ['auth/session-expired', 'expired-code', '인증 시간이 만료되었습니다. 인증번호를 다시 받아주세요.'],
    [
      'auth/account-exists-with-different-credential',
      'phone-already-in-use',
      '이미 다른 계정에서 사용 중인 휴대폰 번호입니다.',
    ],
    ['auth/credential-already-in-use', 'phone-already-in-use', '이미 다른 계정에서 사용 중인 휴대폰 번호입니다.'],
    ['auth/too-many-requests', 'too-many-requests', '인증 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'],
    ['auth/quota-exceeded', 'too-many-requests', '인증 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.'],
    ['auth/network-request-failed', 'network', '네트워크 연결을 확인한 후 다시 시도해주세요.'],
  ] as const)('%s를 사용자용 %s 오류로 매핑', (code, kind, message) => {
    const result = toPhoneAuthError({ code });

    expect(result).toEqual({ kind, message });
    expect(result.message).not.toContain(code);
  });

  it('Firebase 코드가 없는 Error는 linking-failed로 매핑', () => {
    expect(toPhoneAuthError(new Error('raw internal failure'))).toEqual({
      kind: 'linking-failed',
      message: '이메일과 전화번호 연동에 실패했습니다. 처음부터 다시 시도해주세요.',
    });
  });

  it('알 수 없는 Firebase 코드는 내부 코드를 노출하지 않는 unknown으로 매핑', () => {
    const code = 'auth/internal-error';
    const result = toPhoneAuthError({ code });

    expect(result).toEqual({
      kind: 'unknown',
      message: '휴대폰 인증 중 오류가 발생했습니다. 다시 시도해주세요.',
    });
    expect(result.message).not.toContain(code);
  });
});
