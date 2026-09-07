import { act, renderHook } from '@testing-library/react';
import type { Auth, ConfirmationResult, PhoneAuthCredential, User, UserCredential } from 'firebase/auth';
import {
  getAuth,
  linkWithCredential,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  updatePhoneNumber,
} from 'firebase/auth';

import { useLinkPhoneToCurrentUser } from '@/src/entities/phoneAuth/api/useLinkPhoneToCurrentUser';
import { usePhoneAuthCodeSendMutation } from '@/src/entities/phoneAuth/api/usePhoneAuthCodeSendMutation';
import type { IUserDetailData } from '@/src/shared/types';

const fixtures = vi.hoisted(() => ({
  auth: { languageCode: null },
  verifier: { clear: vi.fn(), render: vi.fn(async () => 1) },
  phoneCredential: { providerId: 'phone', signInMethod: 'phone' },
  userWithoutPhone: {
    uid: 'email-user-id',
    email: 'test-user@example.com',
    providerData: [],
  },
  userWithPhone: {
    uid: 'email-user-id',
    email: 'test-user@example.com',
    providerData: [
      {
        displayName: null,
        email: 'test-user@example.com',
        phoneNumber: '+821012345678',
        photoURL: null,
        providerId: 'phone',
        uid: 'phone-user-id',
      },
    ],
  },
}));

function toAuth(value: typeof fixtures.auth): Auth {
  return value as Auth;
}

function toVerifier(value: typeof fixtures.verifier): RecaptchaVerifier {
  return Object.assign(value, {} as RecaptchaVerifier);
}

function toUser(value: typeof fixtures.userWithoutPhone | typeof fixtures.userWithPhone): User {
  return value as User;
}

function toPhoneCredential(value: typeof fixtures.phoneCredential): PhoneAuthCredential {
  return value as PhoneAuthCredential;
}

function userCredential(user: User): UserCredential {
  return { user } as UserCredential;
}

function userData(): IUserDetailData {
  return {
    email: 'test-user@example.com',
    provider: 'kakao',
    userId: 'email-user-id',
  } as IUserDetailData;
}

const confirmationResult = {
  verificationId: 'verification-id',
  confirm: vi.fn<ConfirmationResult['confirm']>(),
} satisfies ConfirmationResult;

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  linkWithCredential: vi.fn(),
  PhoneAuthProvider: { credential: vi.fn() },
  RecaptchaVerifier: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPhoneNumber: vi.fn(),
  updatePhoneNumber: vi.fn(),
}));

vi.mock('@/src/shared/config/firebase', () => ({
  firebaseApp: {},
}));

const originalDefaultPassword = process.env.NEXT_PUBLIC_DEFAULT_PASSWORD;

beforeEach(() => {
  vi.clearAllMocks();
  process.env.NEXT_PUBLIC_DEFAULT_PASSWORD = 'test-default-password';
  vi.mocked(getAuth).mockReturnValue(toAuth(fixtures.auth));
  vi.mocked(signInWithPhoneNumber).mockResolvedValue(confirmationResult);
  vi.mocked(signInWithEmailAndPassword).mockResolvedValue(userCredential(toUser(fixtures.userWithoutPhone)));
  vi.mocked(PhoneAuthProvider.credential).mockReturnValue(toPhoneCredential(fixtures.phoneCredential));
  vi.mocked(linkWithCredential).mockResolvedValue(userCredential(toUser(fixtures.userWithoutPhone)));
  vi.mocked(updatePhoneNumber).mockResolvedValue(undefined);
  vi.mocked(RecaptchaVerifier).mockImplementation(() => toVerifier(fixtures.verifier));
});

afterAll(() => {
  process.env.NEXT_PUBLIC_DEFAULT_PASSWORD = originalDefaultPassword;
});

describe('usePhoneAuthCodeSendMutation', () => {
  it('국내 전화번호를 국제 형식으로 변환해 정확한 Firebase 경계 인자로 전달하고 성공 상태를 갱신', async () => {
    let resolveRequest!: (value: ConfirmationResult) => void;
    vi.mocked(signInWithPhoneNumber).mockImplementationOnce(
      () => new Promise(resolve => (resolveRequest = resolve)),
    );
    const onSuccess = vi.fn();
    const onSettled = vi.fn();
    const { result } = renderHook(() => usePhoneAuthCodeSendMutation({ onSuccess, onSettled }));

    let request!: Promise<void>;
    act(() => {
      request = result.current.mutate('01012345678');
    });
    expect(result.current.isPending).toBe(true);
    expect(signInWithPhoneNumber).toHaveBeenCalledWith(
      toAuth(fixtures.auth),
      '+821012345678',
      toVerifier(fixtures.verifier),
    );

    await act(async () => {
      resolveRequest(confirmationResult);
      await request;
    });

    expect(onSuccess).toHaveBeenCalledWith(confirmationResult);
    expect(onSettled).toHaveBeenCalledTimes(1);
    expect(result.current.sendSmsSuccessMessage).toBe('인증번호가 발송되었습니다.');
    expect(result.current.isPending).toBe(false);
  });

  it('SMS 발송 시 reCAPTCHA verifier를 lazy하게 생성한 뒤 Firebase를 호출한다', async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => usePhoneAuthCodeSendMutation({ onSuccess }));

    await act(() => result.current.mutate('01012345678'));

    expect(RecaptchaVerifier).toHaveBeenCalledTimes(1);
    expect(signInWithPhoneNumber).toHaveBeenCalledWith(
      toAuth(fixtures.auth),
      '+821012345678',
      toVerifier(fixtures.verifier),
    );
    expect(onSuccess).toHaveBeenCalledWith(confirmationResult);
  });

  it('hook이 생성한 reCAPTCHA verifier를 unmount 시 정리한다', async () => {
    const { result, unmount } = renderHook(() => usePhoneAuthCodeSendMutation());

    await act(() => result.current.mutate('01012345678'));
    unmount();

    expect(fixtures.verifier.clear).toHaveBeenCalledTimes(1);
  });

  it('reCAPTCHA 생성 자체가 실패하면 Firebase를 호출하지 않고 error와 settled callback을 실행', async () => {
    const constructError = new Error('reCAPTCHA has already been rendered in this element');
    vi.mocked(RecaptchaVerifier).mockImplementationOnce(() => {
      throw constructError;
    });
    const onError = vi.fn();
    const onSettled = vi.fn();
    const { result } = renderHook(() => usePhoneAuthCodeSendMutation({ onError, onSettled }));

    await act(() => result.current.mutate('01012345678'));

    expect(signInWithPhoneNumber).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(constructError);
    expect(console.error).toHaveBeenCalledWith('Error during signInWithPhoneNumber:', constructError);
    expect(onSettled).toHaveBeenCalledTimes(1);
    expect(result.current.isPending).toBe(false);
  });

  it('Firebase rejection을 동일한 오류로 전달하고 성공 callback 없이 pending을 해제', async () => {
    const firebaseError = new Error('sms rejected');
    vi.mocked(signInWithPhoneNumber).mockRejectedValueOnce(firebaseError);
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const onSettled = vi.fn();
    const { result } = renderHook(() => usePhoneAuthCodeSendMutation({ onSuccess, onError, onSettled }));

    await act(() => result.current.mutate('01012345678'));

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(firebaseError);
    expect(console.error).toHaveBeenCalledWith('Error during signInWithPhoneNumber:', firebaseError);
    expect(onSettled).toHaveBeenCalledTimes(1);
    expect(result.current.isPending).toBe(false);
  });
});

describe('useLinkPhoneToCurrentUser', () => {
  it('phone provider가 없으면 로그인과 credential 생성 후 user에 credential을 연결', async () => {
    const onSuccess = vi.fn();
    const onSettled = vi.fn();
    const { result } = renderHook(() => useLinkPhoneToCurrentUser(userData(), { onSuccess, onSettled }));

    await act(() => result.current.mutate('123456', confirmationResult));

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      toAuth(fixtures.auth),
      'test-user@example.com',
      'test-default-password',
    );
    expect(PhoneAuthProvider.credential).toHaveBeenCalledWith('verification-id', '123456');
    expect(linkWithCredential).toHaveBeenCalledWith(
      toUser(fixtures.userWithoutPhone),
      toPhoneCredential(fixtures.phoneCredential),
    );
    expect(vi.mocked(signInWithEmailAndPassword).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(PhoneAuthProvider.credential).mock.invocationCallOrder[0],
    );
    expect(vi.mocked(PhoneAuthProvider.credential).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(linkWithCredential).mock.invocationCallOrder[0],
    );
    expect(updatePhoneNumber).not.toHaveBeenCalled();
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.sendSmsConfirmSuccessMessage).toBe('인증코드가 확인되었습니다.');
    expect(result.current.isPending).toBe(false);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSettled).toHaveBeenCalledTimes(1);
  });

  it('phone provider가 있으면 기존 user 전화번호만 갱신', async () => {
    vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce(userCredential(toUser(fixtures.userWithPhone)));
    const { result } = renderHook(() => useLinkPhoneToCurrentUser(userData()));

    await act(() => result.current.mutate('654321', confirmationResult));

    expect(updatePhoneNumber).toHaveBeenCalledWith(
      toUser(fixtures.userWithPhone),
      toPhoneCredential(fixtures.phoneCredential),
    );
    expect(vi.mocked(signInWithEmailAndPassword).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(PhoneAuthProvider.credential).mock.invocationCallOrder[0],
    );
    expect(vi.mocked(PhoneAuthProvider.credential).mock.invocationCallOrder[0]).toBeLessThan(
      vi.mocked(updatePhoneNumber).mock.invocationCallOrder[0],
    );
    expect(linkWithCredential).not.toHaveBeenCalled();
    expect(result.current.isSuccess).toBe(true);
  });

  it('confirmation result가 없으면 Firebase 후속 호출 없이 pending을 해제', async () => {
    const { result } = renderHook(() => useLinkPhoneToCurrentUser(userData()));

    await act(() => result.current.mutate('123456', null));

    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
    expect(PhoneAuthProvider.credential).not.toHaveBeenCalled();
    expect(linkWithCredential).not.toHaveBeenCalled();
    expect(updatePhoneNumber).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('No confirmation result found.');
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
  });

  it('로그인 실패 시 credential, link, update를 호출하지 않고 동일한 오류를 전달', async () => {
    const loginError = new Error('login failed');
    vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce(loginError);
    const onError = vi.fn();
    const { result } = renderHook(() => useLinkPhoneToCurrentUser(userData(), { onError }));

    await act(() => result.current.mutate('123456', confirmationResult));

    expect(PhoneAuthProvider.credential).not.toHaveBeenCalled();
    expect(linkWithCredential).not.toHaveBeenCalled();
    expect(updatePhoneNumber).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(loginError);
    expect(console.error).toHaveBeenCalledWith('Error linking phone number:', loginError);
    expect(result.current.getError()).toEqual({
      kind: 'linking-failed',
      message: '이메일과 전화번호 연동에 실패했습니다. 처음부터 다시 시도해주세요.',
    });
    expect(result.current.isSuccess).toBe(false);
  });

  it('credential 생성 실패 시 link와 update를 호출하지 않음', async () => {
    const credentialError = new Error('credential failed');
    vi.mocked(PhoneAuthProvider.credential).mockImplementationOnce(() => {
      throw credentialError;
    });
    const onError = vi.fn();
    const { result } = renderHook(() => useLinkPhoneToCurrentUser(userData(), { onError }));

    await act(() => result.current.mutate('123456', confirmationResult));

    expect(linkWithCredential).not.toHaveBeenCalled();
    expect(updatePhoneNumber).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(credentialError);
    expect(console.error).toHaveBeenCalledWith('Error linking phone number:', credentialError);
    expect(result.current.isSuccess).toBe(false);
  });

  it.each([
    ['link', false, linkWithCredential],
    ['update', true, updatePhoneNumber],
  ] as const)('%s 실패 시 성공 상태 없이 정규화된 오류와 원본 오류를 제공', async (_label, hasPhone, failingCall) => {
    const firebaseError = Object.assign(new Error('network failed'), { code: 'auth/network-request-failed' });
    if (hasPhone) {
      vi.mocked(signInWithEmailAndPassword).mockResolvedValueOnce(userCredential(toUser(fixtures.userWithPhone)));
    }
    vi.mocked(failingCall).mockRejectedValueOnce(firebaseError);
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const onSettled = vi.fn();
    const { result } = renderHook(() =>
      useLinkPhoneToCurrentUser(userData(), { onSuccess, onError, onSettled }),
    );

    await act(() => result.current.mutate('123456', confirmationResult));

    expect(result.current.isSuccess).toBe(false);
    expect(result.current.getError()).toEqual({
      kind: 'network',
      message: '네트워크 연결을 확인한 후 다시 시도해주세요.',
    });
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(firebaseError);
    expect(console.error).toHaveBeenCalledWith('Error linking phone number:', firebaseError);
    expect(onSettled).toHaveBeenCalledTimes(1);
    expect(result.current.isPending).toBe(false);
  });

  it('reset 호출 시 성공 상태, 안내 메시지, 오류를 모두 초기화', async () => {
    const { result } = renderHook(() => useLinkPhoneToCurrentUser(userData()));

    await act(() => result.current.mutate('123456', confirmationResult));
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.sendSmsConfirmSuccessMessage).toBe('인증코드가 확인되었습니다.');

    act(() => result.current.reset());

    expect(result.current.isSuccess).toBe(false);
    expect(result.current.sendSmsConfirmSuccessMessage).toBe('');
    expect(result.current.getError()).toBeNull();
  });
});
