import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
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
import { useForm } from 'react-hook-form';

import { usePhoneAuthLinkFlow } from '@/src/entities/phoneAuth/model/usePhoneAuthLinkFlow';
import { usePhoneAuthVerifyFlow } from '@/src/entities/phoneAuth/model/usePhoneAuthVerifyFlow';
import { PhoneAuthFields } from '@/src/entities/phoneAuth/ui/PhoneAuthFields';
import type { IUserDetailData } from '@/src/shared/types';
import { Form } from '@/src/shared/ui/form';

type TFormValues = { phoneNumber: string; authCode: string };

const fixtures = vi.hoisted(() => ({
  auth: { languageCode: null },
  verifier: { clear: vi.fn(), render: vi.fn(async () => 1) },
  phoneCredential: { providerId: 'phone', signInMethod: 'phone' },
  emailUser: { uid: 'email-user-id', email: 'test-user@example.com', providerData: [] },
}));

function toAuth(value: typeof fixtures.auth): Auth {
  return value as Auth;
}

function toVerifier(value: typeof fixtures.verifier): RecaptchaVerifier {
  return Object.assign(value, {} as RecaptchaVerifier);
}

function toUser(value: typeof fixtures.emailUser): User {
  return value as unknown as User;
}

function toPhoneCredential(value: typeof fixtures.phoneCredential): PhoneAuthCredential {
  return value as PhoneAuthCredential;
}

function userCredential(user: User): UserCredential {
  return { user } as UserCredential;
}

function userData(): IUserDetailData {
  return { email: 'test-user@example.com', provider: 'kakao', userId: 'email-user-id' } as IUserDetailData;
}

function confirmationResult(): ConfirmationResult {
  return {
    verificationId: 'verification-id',
    confirm: vi.fn<ConfirmationResult['confirm']>().mockResolvedValue(userCredential(toUser(fixtures.emailUser))),
  } satisfies ConfirmationResult;
}

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  linkWithCredential: vi.fn(),
  PhoneAuthProvider: { credential: vi.fn() },
  RecaptchaVerifier: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPhoneNumber: vi.fn(),
  updatePhoneNumber: vi.fn(),
}));

vi.mock('@/src/shared/config/firebase', () => ({ firebaseApp: {} }));

const originalDefaultPassword = process.env.NEXT_PUBLIC_DEFAULT_PASSWORD;

beforeEach(() => {
  vi.clearAllMocks();
  process.env.NEXT_PUBLIC_DEFAULT_PASSWORD = 'test-default-password';
  vi.mocked(getAuth).mockReturnValue(toAuth(fixtures.auth));
  vi.mocked(signInWithPhoneNumber).mockResolvedValue(confirmationResult());
  vi.mocked(signInWithEmailAndPassword).mockResolvedValue(userCredential(toUser(fixtures.emailUser)));
  vi.mocked(PhoneAuthProvider.credential).mockReturnValue(toPhoneCredential(fixtures.phoneCredential));
  vi.mocked(linkWithCredential).mockResolvedValue(userCredential(toUser(fixtures.emailUser)));
  vi.mocked(updatePhoneNumber).mockResolvedValue(undefined);
  vi.mocked(RecaptchaVerifier).mockImplementation(() => toVerifier(fixtures.verifier));
});

afterAll(() => {
  process.env.NEXT_PUBLIC_DEFAULT_PASSWORD = originalDefaultPassword;
});

function useHarness(
  useFlow: (form: ReturnType<typeof useForm<TFormValues>>) => ReturnType<typeof usePhoneAuthVerifyFlow<TFormValues>>,
) {
  const form = useForm<TFormValues>({ defaultValues: { phoneNumber: '01012345678', authCode: '' } });
  // RHF의 formState는 Proxy 기반이라, 렌더 중 실제로 읽은 필드만 구독되어 재렌더를 유발한다.
  // 테스트에서 errors를 검증하려면 여기서 한 번 읽어 구독을 등록해야 한다.
  void form.formState.errors;
  const flow = useFlow(form);
  return { form, flow };
}

function clickEvent() {
  return { preventDefault: () => {} } as React.MouseEvent<HTMLButtonElement>;
}

function PhoneAuthFieldsHarness({ onConfirmed }: { onConfirmed?: (result: UserCredential) => Promise<unknown> | void }) {
  const form = useForm<TFormValues>({ defaultValues: { phoneNumber: '01012345678', authCode: '' } });
  const phoneAuth = usePhoneAuthVerifyFlow(
    form,
    {
      phoneNumberName: 'phoneNumber',
      authCodeName: 'authCode',
    },
    { onConfirmed },
  );

  return (
    <Form {...form}>
      <PhoneAuthFields
        authCodeName="authCode"
        control={form.control}
        phoneAuth={phoneAuth}
        phoneNumberName="phoneNumber"
      />
    </Form>
  );
}

describe('usePhoneAuthVerifyFlow', () => {
  it('인증번호 발송 후에는 인증 대상 전화번호를 수정할 수 없음', async () => {
    render(<PhoneAuthFieldsHarness />);

    fireEvent.click(screen.getByRole('button', { name: '인증받기' }));

    await waitFor(() => expect(screen.getByLabelText('휴대폰번호')).toBeDisabled());
  });

  it('인증 성공 후처리 중에는 인증 흐름을 재시작할 수 없음', async () => {
    let resolveOnConfirmed: (() => void) | undefined;
    const handleConfirmed = () =>
      new Promise<void>(resolve => {
        resolveOnConfirmed = resolve;
      });
    render(<PhoneAuthFieldsHarness onConfirmed={handleConfirmed} />);

    fireEvent.click(screen.getByRole('button', { name: '인증받기' }));
    const authCodeInput = await screen.findByLabelText('인증코드');
    fireEvent.change(authCodeInput, { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: '인증하기' }));

    await waitFor(() => expect(screen.getByRole('button', { name: '다시 인증하기' })).toBeDisabled());

    act(() => resolveOnConfirmed?.());
    await waitFor(() => expect(screen.getByRole('button', { name: '다시 인증하기' })).toBeEnabled());
  });

  it('발송 성공 시 인증코드 입력을 열고 안내 메시지를 반영', async () => {
    const { result } = renderHook(() =>
      useHarness(form => usePhoneAuthVerifyFlow(form, { phoneNumberName: 'phoneNumber', authCodeName: 'authCode' })),
    );

    await act(() => result.current.flow.onSendClick(clickEvent()));

    expect(result.current.flow.isAuthCodeOpen).toBe(true);
    expect(result.current.flow.sendSmsSuccessMessage).toBe('인증번호가 발송되었습니다.');
  });

  it('confirm 성공 시 authCodeSuccess와 안내 메시지를 반영하고 onConfirmed를 호출', async () => {
    const onConfirmed = vi.fn();
    const { result } = renderHook(() =>
      useHarness(form =>
        usePhoneAuthVerifyFlow(form, { phoneNumberName: 'phoneNumber', authCodeName: 'authCode' }, { onConfirmed }),
      ),
    );

    await act(() => result.current.flow.onSendClick(clickEvent()));
    act(() => result.current.form.setValue('authCode', '123456'));
    await act(() => result.current.flow.onConfirmClick(clickEvent()));

    expect(result.current.flow.authCodeSuccess).toBe(true);
    expect(result.current.flow.sendSmsConfirmSuccessMessage).toBe('인증코드가 확인되었습니다.');
    expect(onConfirmed).toHaveBeenCalledTimes(1);
  });

  it('비동기 onConfirmed가 완료된 뒤에만 인증 성공 상태를 반영', async () => {
    let resolveOnConfirmed: ((token: string) => void) | undefined;
    const onConfirmed = vi.fn(
      () =>
        new Promise<string>(resolve => {
          resolveOnConfirmed = resolve;
        }),
    );
    const { result } = renderHook(() =>
      useHarness(form =>
        usePhoneAuthVerifyFlow(form, { phoneNumberName: 'phoneNumber', authCodeName: 'authCode' }, { onConfirmed }),
      ),
    );

    await act(() => result.current.flow.onSendClick(clickEvent()));
    act(() => result.current.form.setValue('authCode', '123456'));

    let confirmPromise: Promise<void> | undefined;
    act(() => {
      confirmPromise = result.current.flow.onConfirmClick(clickEvent());
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(onConfirmed).toHaveBeenCalledTimes(1);
    expect(result.current.flow.authCodeSuccess).toBe(false);

    resolveOnConfirmed?.('phone-id-token');
    await act(async () => {
      await confirmPromise;
    });

    expect(result.current.flow.authCodeSuccess).toBe(true);
  });

  it('confirm 실패(auth/invalid-verification-code) 시 authCode 필드에 사용자용 에러 설정', async () => {
    const failingConfirmationResult: ConfirmationResult = {
      verificationId: 'verification-id',
      confirm: vi
        .fn<ConfirmationResult['confirm']>()
        .mockRejectedValue(Object.assign(new Error('invalid code'), { code: 'auth/invalid-verification-code' })),
    };
    vi.mocked(signInWithPhoneNumber).mockResolvedValueOnce(failingConfirmationResult);

    const { result } = renderHook(() =>
      useHarness(form => usePhoneAuthVerifyFlow(form, { phoneNumberName: 'phoneNumber', authCodeName: 'authCode' })),
    );

    await act(() => result.current.flow.onSendClick(clickEvent()));
    act(() => result.current.form.setValue('authCode', '000000'));
    await act(() => result.current.flow.onConfirmClick(clickEvent()));

    expect(result.current.flow.authCodeSuccess).toBe(false);
    expect(result.current.form.formState.errors.authCode?.message).toBe('인증코드가 틀렸습니다.');
  });

  it('restart 호출 시 인증 상태와 폼을 모두 초기화', async () => {
    const { result } = renderHook(() =>
      useHarness(form => usePhoneAuthVerifyFlow(form, { phoneNumberName: 'phoneNumber', authCodeName: 'authCode' })),
    );

    await act(() => result.current.flow.onSendClick(clickEvent()));
    act(() => result.current.form.setValue('authCode', '123456'));
    await act(() => result.current.flow.onConfirmClick(clickEvent()));
    expect(result.current.flow.authCodeSuccess).toBe(true);

    act(() => result.current.flow.onRestartClick());

    expect(result.current.flow.isAuthCodeOpen).toBe(false);
    expect(result.current.flow.authCodeSuccess).toBe(false);
    expect(result.current.flow.sendSmsSuccessMessage).toBe('');
    expect(result.current.form.getValues('authCode')).toBe('');
  });
});

describe('usePhoneAuthLinkFlow', () => {
  it('이미 다른 계정에서 사용 중인 번호일 때 onPhoneAlreadyInUse를 호출', async () => {
    const firebaseError = Object.assign(new Error('credential in use'), {
      code: 'auth/credential-already-in-use',
    });
    vi.mocked(linkWithCredential).mockRejectedValueOnce(firebaseError);
    const onPhoneAlreadyInUse = vi.fn();

    const { result } = renderHook(() =>
      useHarness(form =>
        usePhoneAuthLinkFlow(
          form,
          { phoneNumberName: 'phoneNumber', authCodeName: 'authCode' },
          userData(),
          { onPhoneAlreadyInUse },
        ),
      ),
    );

    await act(() => result.current.flow.onSendClick(clickEvent()));
    act(() => result.current.form.setValue('authCode', '123456'));
    await act(() => result.current.flow.onConfirmClick(clickEvent()));

    expect(onPhoneAlreadyInUse).toHaveBeenCalledWith({
      kind: 'phone-already-in-use',
      message: '이미 다른 계정에서 사용 중인 휴대폰 번호입니다.',
    });
  });

  it('confirmedMessage가 주어지면 성공 시 기본 문구 대신 커스텀 문구를 사용', async () => {
    const { result } = renderHook(() =>
      useHarness(form =>
        usePhoneAuthLinkFlow(form, { phoneNumberName: 'phoneNumber', authCodeName: 'authCode' }, userData(), {
          confirmedMessage: '커스텀 완료 문구',
        }),
      ),
    );

    await act(() => result.current.flow.onSendClick(clickEvent()));
    act(() => result.current.form.setValue('authCode', '123456'));
    await act(() => result.current.flow.onConfirmClick(clickEvent()));

    expect(result.current.flow.sendSmsConfirmSuccessMessage).toBe('커스텀 완료 문구');
  });
});
