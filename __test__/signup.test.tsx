import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RecaptchaVerifier } from 'firebase/auth';
import { linkWithCredential, signInWithEmailAndPassword, signInWithPhoneNumber } from 'firebase/auth';
import { http, HttpResponse } from 'msw';
import type { Mock } from 'vitest';

import { server } from '@/src/__mock__/node';
import type { TAliasAny } from '@/src/shared/types';
import * as utils from '@/src/shared/utils';
import { renderWithQueryClient } from '@/src/shared/utils/test/render';
import { SignupPage } from '@/src/views/signup';

const pushMock = vi.fn();
const replaceMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
  usePathname: () => '/login',
  useSearchParams: () => new URLSearchParams(''),
  useParams: () => ({ shopId: 'shopId' }),
}));

vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual<TAliasAny>('firebase/auth');

  return {
    getAuth: vi.fn(),
    RecaptchaVerifier: vi.fn(() => ({
      render: vi.fn(() => Promise.resolve(1)),
      clear: vi.fn(),
    })) as unknown as typeof RecaptchaVerifier,
    signInWithPhoneNumber: vi.fn(() => Promise.resolve({})),
    signInWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: { uid: 'mock-uid', email: 'test@example.com' } })),
    PhoneAuthProvider: {
      ...actual.PhoneAuthProvider,
      credential: vi.fn(() => ({
        providerId: 'phone',
        signInMethod: 'phone',
        // 필요한 mock 프로퍼티 추가
      })),
    },
    linkWithCredential: vi.fn(() => Promise.resolve({ user: { uid: 'mock-uid', phoneNumber: '+821012345678' } })),
  };
});

vi.mock('@/src/shared/config/firebase', () => ({
  firebaseApp: {
    auth: vi.fn(),
  },
}));

vi.mock('@/src/shared/utils', async () => {
  // 원본 모듈 import
  const actual = await vi.importActual('@/src/shared/utils');
  return {
    ...actual,
    toastSuccess: vi.fn(),
    toastError: vi.fn(),
  };
});

vi.mock('react-google-recaptcha-v3', () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: () => Promise.resolve('recaptcha-token'),
  }),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('SignupPage 컴포넌트 테스트', () => {
  it('렌더링 테스트', async () => {
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    expect(screen.getByText('고운황금손 회원가입')).toBeInTheDocument();
    expect(screen.getByLabelText(/이름/)).toHaveValue('테스트 사용자');
    expect(screen.getByLabelText(/닉네임/)).toHaveValue('testnick');
    expect(screen.getByLabelText(/휴대폰번호/)).toHaveValue('01012345678');
  });

  it('이름이 2자리 미만일 때 에러 메시지 노출', async () => {
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    const nameInput = screen.getByLabelText(/이름/);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, '가');

    expect(await screen.findByText('2자리 이상 입력해주세요')).toBeInTheDocument();
  });

  it('이름이 20자리 초과일 때 에러 메시지 노출', async () => {
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    const nameInput = screen.getByLabelText(/이름/);
    await userEvent.clear(nameInput);
    await userEvent.type(
      nameInput,
      '가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하',
    );

    expect(await screen.findByText('20자리 이하로 입력해주세요')).toBeInTheDocument();
  });

  it('닉네임이 2자리 미만일 때 에러 메시지 노출', async () => {
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    const nicknameInput = screen.getByLabelText(/닉네임/);
    await userEvent.clear(nicknameInput);
    await userEvent.type(nicknameInput, '가');

    expect(await screen.findByText('2자리 이상 입력해주세요')).toBeInTheDocument();
  });

  it('닉네임이 20자리 초과일 때 에러 메시지 노출', async () => {
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    const nicknameInput = screen.getByLabelText(/닉네임/);
    await userEvent.clear(nicknameInput);
    await userEvent.type(
      nicknameInput,
      '가나다라마바사아자차카타파하가나다라마바사아자차카타파하가나다라마바사아자차카타파하',
    );

    expect(await screen.findByText('20자리 이하로 입력해주세요')).toBeInTheDocument();
  });

  it('휴대폰 번호 형식이 올바르지 않을 때 에러 메시지 노출', async () => {
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    const phoneNumberInput = screen.getByLabelText(/휴대폰번호/);
    await userEvent.clear(phoneNumberInput);
    await userEvent.type(phoneNumberInput, '1234567890');

    expect(await screen.findByText('올바른 휴대폰 번호를 입력해주세요. (예: 01012345678)')).toBeInTheDocument();
  });

  it('이메일 형식이 올바르지 않을 때 에러 메시지 노출', async () => {
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    const emailInput = screen.getByLabelText(/이메일/);
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'invalid-email');

    expect(await screen.findByText('올바른 이메일을 입력해주세요')).toBeInTheDocument();
  });

  it('[휴대폰인증] 올바른 휴대폰 번호 형식을 입력해야만 인증번호 전송 버튼 활성화', async () => {
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    const phoneNumberInput = screen.getByLabelText(/휴대폰번호/);
    await userEvent.clear(phoneNumberInput);
    await userEvent.type(phoneNumberInput, '1234567890');

    // invalid한 휴대폰 번호 입력 시 비활성화
    expect(screen.getByRole('button', { name: '인증받기' })).toBeDisabled();

    await userEvent.clear(phoneNumberInput);
    await userEvent.type(phoneNumberInput, '01012345678');

    // valid한 휴대폰 번호 입력 시 활성화
    expect(screen.getByRole('button', { name: '인증받기' })).toBeEnabled();
  });

  it('[휴대폰인증] 인증번호 전송 버튼 클릭했을 때 API 호출', async () => {
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    const sendButton = screen.getByRole('button', { name: '인증받기' });
    await userEvent.click(sendButton);

    expect(signInWithPhoneNumber).toHaveBeenCalled();
  });

  it('[휴대폰인증] 인증번호 발송 성공 시 버튼 문구가 인증받기->인증번호 발송완료로 변경되는지 확인', async () => {
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    const sendButton = screen.getByRole('button', { name: '인증받기' });
    await userEvent.click(sendButton);

    expect(await screen.findByText('인증번호 발송완료')).toBeInTheDocument();
    expect(screen.queryByText('인증받기')).not.toBeInTheDocument();
  });

  it('[휴대폰인증] 인증번호 발송 실패 시 에러 메시지 노출', async () => {
    (signInWithPhoneNumber as Mock).mockImplementationOnce(() => Promise.reject(new Error('인증번호 발송 실패')));

    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    const sendButton = screen.getByRole('button', { name: '인증받기' });
    await userEvent.click(sendButton);

    expect(await screen.findByText('인증번호 발송에 실패했습니다. 다시 시도해주세요.')).toBeInTheDocument();
  });

  it('[휴대폰인증] 인증코드가 6자리가 아닐 때 에러 메시지 노출', async () => {
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    const sendButton = screen.getByRole('button', { name: '인증받기' });
    await userEvent.click(sendButton);

    const authCodeInput = screen.getByLabelText(/인증코드/);
    await userEvent.clear(authCodeInput);
    await userEvent.type(authCodeInput, '12345');

    expect(await screen.findByText('인증코드는 6자리입니다.')).toBeInTheDocument();
  });

  it('[휴대폰인증] 인증코드가 6자리일 때 인증하기 버튼 활성화', async () => {
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    const sendButton = screen.getByRole('button', { name: '인증받기' });
    await userEvent.click(sendButton);

    const authCodeInput = screen.getByLabelText(/인증코드/);
    await userEvent.clear(authCodeInput);

    expect(screen.getByRole('button', { name: '인증하기' })).toBeDisabled();
    await userEvent.type(authCodeInput, '123456');

    expect(screen.getByRole('button', { name: '인증하기' })).toBeEnabled();
  });

  it('[휴대폰인증] 인증하기 버튼 클릭했을 때 API 호출', async () => {
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    const sendButton = screen.getByRole('button', { name: '인증받기' });
    await userEvent.click(sendButton);

    const authCodeInput = screen.getByLabelText(/인증코드/);
    await userEvent.clear(authCodeInput);
    await userEvent.type(authCodeInput, '123456');

    const authCodeSendButton = screen.getByRole('button', { name: '인증하기' });
    await userEvent.click(authCodeSendButton);

    expect(signInWithEmailAndPassword).toHaveBeenCalled();
    expect(linkWithCredential).toHaveBeenCalled();
  });

  it('[휴대폰인증] 인증 성공 시 버튼 문구가 인증하기->인증완료로 변경되는지 확인', async () => {
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    const sendButton = screen.getByRole('button', { name: '인증받기' });
    await userEvent.click(sendButton);

    const authCodeInput = screen.getByLabelText(/인증코드/);
    await userEvent.clear(authCodeInput);
    await userEvent.type(authCodeInput, '123456');

    const authCodeSendButton = screen.getByRole('button', { name: '인증하기' });
    await userEvent.click(authCodeSendButton);

    expect(await screen.findByText('인증완료')).toBeInTheDocument();
    expect(screen.queryByText('인증하기')).not.toBeInTheDocument();
  });

  it('[휴대폰인증] 인증 실패 시 에러 메시지 노출', async () => {
    (signInWithEmailAndPassword as Mock).mockImplementationOnce(() => Promise.reject(new Error('이메일 로그인 실패')));
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    const sendButton = screen.getByRole('button', { name: '인증받기' });
    await userEvent.click(sendButton);

    const authCodeInput = screen.getByLabelText(/인증코드/);
    await userEvent.clear(authCodeInput);
    await userEvent.type(authCodeInput, '123456');

    const authCodeSendButton = screen.getByRole('button', { name: '인증하기' });
    await userEvent.click(authCodeSendButton);

    expect(
      await screen.findByText('이메일과 전화번호 연동에 실패했습니다. 처음부터 다시 시도해주세요.'),
    ).toBeInTheDocument();
  });

  it('모든 필드가 올바르게 입력되었어도, 인증이 안되었으면 회원가입 버튼 비활성화', async () => {
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    const sendButton = screen.getByRole('button', { name: '인증받기' });
    await userEvent.click(sendButton);

    const authCodeInput = screen.getByLabelText(/인증코드/);

    await userEvent.clear(authCodeInput);
    await userEvent.type(authCodeInput, '123456');

    const finalSignupButton = screen.getByRole('button', { name: '회원가입' });
    expect(finalSignupButton).toBeDisabled();
  });

  it('모든 필드가 올바르게 입력되었고, 인증도 성공했을때만 회원가입 버튼 비활성화', async () => {
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);
    const finalSignupButton = screen.getByRole('button', { name: '회원가입' });

    const sendButton = screen.getByRole('button', { name: '인증받기' });
    await userEvent.click(sendButton);

    const authCodeInput = screen.getByLabelText(/인증코드/);

    expect(finalSignupButton).toBeDisabled();
    await userEvent.clear(authCodeInput);
    await userEvent.type(authCodeInput, '123456');

    const authCodeSendButton = screen.getByRole('button', { name: '인증하기' });
    await userEvent.click(authCodeSendButton);

    expect(finalSignupButton).toBeEnabled();
  });

  it('폼 제출 시 입력한 데이터가 전송되는지 확인', async () => {
    const handler = vi.fn(async ({ request }) => {
      const body = await request.json();
      // 여기서 body 검증
      expect(body).toEqual({
        name: '테스트 사용자',
        nickname: 'testnick',
        phoneNumber: '01012345678',
        email: 'test-user@example.com',
        authCode: '123456', // 추가된 부분
      });

      return HttpResponse.json({
        response: 'ok',
        message: '회원가입 성공',
      });
    });
    server.use(http.post('/api/signup', handler));
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    const sendButton = screen.getByRole('button', { name: '인증받기' });
    await userEvent.click(sendButton);

    const authCodeInput = screen.getByLabelText(/인증코드/);
    await userEvent.clear(authCodeInput);
    await userEvent.type(authCodeInput, '123456');

    const authCodeSendButton = screen.getByRole('button', { name: '인증하기' });
    await userEvent.click(authCodeSendButton);

    const finalSignupButton = screen.getByRole('button', { name: '회원가입' });
    await userEvent.click(finalSignupButton);

    await waitFor(() => {
      expect(handler).toHaveBeenCalled();
      expect(utils.toastSuccess).toHaveBeenCalledWith('회원가입 성공!\n잠시 후 메인 페이지로 이동합니다.');
    });
  });

  it('폼 제출 실패 시 에러 메시지 노출', async () => {
    const handler = vi.fn(async () => {
      return HttpResponse.json({
        response: 'ng',
        message: '회원가입 실패 이유 MSG',
      });
    });
    server.use(http.post('/api/signup', handler));
    const data = await (await fetch('/api/user')).json();
    renderWithQueryClient(<SignupPage userData={data.userData} />);

    const sendButton = screen.getByRole('button', { name: '인증받기' });
    await userEvent.click(sendButton);

    const authCodeInput = screen.getByLabelText(/인증코드/);
    await userEvent.clear(authCodeInput);
    await userEvent.type(authCodeInput, '123456');

    const authCodeSendButton = screen.getByRole('button', { name: '인증하기' });
    await userEvent.click(authCodeSendButton);

    const finalSignupButton = screen.getByRole('button', { name: '회원가입' });
    await userEvent.click(finalSignupButton);

    await waitFor(() => {
      expect(handler).toHaveBeenCalled();
      expect(utils.toastError).toHaveBeenCalledWith('회원가입에 실패했습니다.\n회원가입 실패 이유 MSG');
    });
  });
});
