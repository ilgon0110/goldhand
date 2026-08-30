/* eslint-disable react/jsx-handler-names */
import { QueryClient } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RecaptchaVerifier } from 'firebase/auth';
import { signInWithPhoneNumber } from 'firebase/auth';
import { http, HttpResponse } from 'msw';
import { Suspense, useEffect } from 'react';

import { GuestConfirmationStep } from '@/app/review/form/ui/_GuestConfirmationStep';
import { GuestReviewFormStep } from '@/app/review/form/ui/_GuestReviewFormStep';
import { MemberReviewForm } from '@/app/review/form/ui/_MemberReviewForm';
import { ReviewFormPage } from '@/app/review/form/ui/ReviewFormPage';
import { server } from '@/src/__mock__/node';
import { mockUserData } from '@/src/__mock__/user';
import { userKeys } from '@/src/shared/config/queryKeys';
import type { IUserResponseData, TAliasAny } from '@/src/shared/types';
import { renderWithQueryClient } from '@/src/shared/utils/test/render';
import { ImagesContext, useImagesContext } from '@/src/widgets/editor/context/ImagesContext';

const mockNonUserData: IUserResponseData = {
  response: 'ok',
  message: '성공',
  accessToken: null,
  userData: null,
  isLinked: false,
};

// useRouter 모킹
const pushMock = vi.fn();
const replaceMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
    refresh: vi.fn(),
  }),
  usePathname: () => '/review/form',
  useSearchParams: () => new URLSearchParams('mode=create'),
}));

vi.mock('@/src/widgets/editor/ui/Editor', () => {
  return {
    Editor: ({ onEditorChange }: { onEditorChange: (editor: TAliasAny) => void }) => {
      useEffect(() => {
        onEditorChange({ read: (cb: () => void) => cb() });
      }, [onEditorChange]);
      return <div>Editor Mock Component</div>;
    },
  };
});

vi.mock('@lexical/html', () => ({
  $generateHtmlFromNodes: () => '<p>mock html</p>',
}));

vi.mock('@/src/shared/hooks/useMediaQuery', () => ({
  useMediaQuery: () => true, // 항상 데스크탑 뷰포트로 간주
}));

vi.mock('firebase/auth', async () => {
  const actual = await vi.importActual<TAliasAny>('firebase/auth');

  return {
    getAuth: vi.fn(() => ({ languageCode: null })),
    RecaptchaVerifier: vi.fn(() => ({
      render: vi.fn(() => Promise.resolve(1)),
      clear: vi.fn(),
    })) as unknown as typeof RecaptchaVerifier,
    signInWithPhoneNumber: vi.fn(() =>
      Promise.resolve({
        confirm: vi.fn(() =>
          Promise.resolve({
            user: { getIdToken: () => Promise.resolve('mock-phone-id-token') },
          } as TAliasAny),
        ),
      }),
    ),
    PhoneAuthProvider: actual.PhoneAuthProvider,
  };
});

vi.mock('@/src/shared/config/firebase', () => ({
  firebaseApp: {
    auth: vi.fn(),
  },
}));

vi.mock('@/src/shared/ui/checkbox', async () => {
  return {
    Checkbox: ({
      checked,
      defaultChecked,
      onCheckedChange,
      ...props
    }: {
      checked?: boolean;
      defaultChecked?: boolean;
      onCheckedChange?: (checked: boolean) => void;
      [key: string]: TAliasAny;
    }) => (
      <input
        type="checkbox"
        {...(checked !== undefined ? { checked } : { defaultChecked })}
        onChange={e => onCheckedChange?.(e.target.checked)}
        {...props}
      />
    ),
  };
});

beforeAll(() => {
  function createMockPointerEvent(type: string, props: PointerEventInit = {}): PointerEvent {
    const event = new Event(type, props) as PointerEvent;
    Object.assign(event, {
      button: props.button ?? 0,
      ctrlKey: props.ctrlKey ?? false,
      pointerType: props.pointerType ?? 'mouse',
    });
    return event;
  }
  window.PointerEvent = createMockPointerEvent as TAliasAny;
  Object.assign(window.HTMLElement.prototype, {
    scrollIntoView: vi.fn(),
    releasePointerCapture: vi.fn(),
    hasPointerCapture: vi.fn(),
  });
});

afterEach(() => {
  vi.clearAllMocks();
});

function renderReviewForm(userData: IUserResponseData) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(userKeys.all, userData);

  return renderWithQueryClient(
    <Suspense fallback={null}>
      <ReviewFormPage />
    </Suspense>,
    { queryClient },
  );
}

function renderMemberReviewForm() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(userKeys.all, mockUserData);

  return renderWithQueryClient(<MemberReviewForm />, { queryClient });
}

const GuestImagesHarness = ({ onRestartVerification }: { onRestartVerification: () => void }) => {
  const { images, setImages } = useImagesContext();

  useEffect(() => {
    setImages([{ key: 'draft-image', file: new File(['image'], 'draft.png', { type: 'image/png' }) }]);
  }, [setImages]);

  return (
    <>
      <output aria-label="첨부 이미지 수">{images?.length ?? 0}</output>
      <GuestReviewFormStep
        verification={{ phoneNumber: '01012345678', phoneIdToken: 'verified-token' }}
        onRestartVerification={onRestartVerification}
      />
    </>
  );
};

async function selectFranchisee() {
  const franchiseeTrigger = screen.getByTestId('franchisee-select-trigger');
  await userEvent.click(franchiseeTrigger);
  const optionToSelect = await waitFor(() => screen.findByText(/전체/, { selector: 'span' }));
  await userEvent.click(optionToSelect);
}

async function completeGuestVerification(phoneNumber = '01012345678') {
  await userEvent.type(await screen.findByLabelText(/휴대폰번호/), phoneNumber);
  fireEvent.click(screen.getByRole('checkbox'));
  await userEvent.click(screen.getByRole('button', { name: '인증받기' }));
  await userEvent.type(await screen.findByLabelText(/인증코드/), '123456');
  await userEvent.click(screen.getByRole('button', { name: '인증하기' }));
  await screen.findByRole('heading', { name: '후기 작성' });
}

describe('GuestConfirmationStep 컴포넌트 테스트', () => {
  it('인증 성공 시 휴대폰번호와 ID 토큰만 전달한다.', async () => {
    const onConfirmed = vi.fn();
    render(<GuestConfirmationStep onConfirmed={onConfirmed} />);

    await userEvent.type(screen.getByLabelText(/휴대폰번호/), '01012345678');
    fireEvent.click(screen.getByRole('checkbox'));
    await userEvent.click(screen.getByRole('button', { name: '인증받기' }));
    await userEvent.type(await screen.findByLabelText(/인증코드/), '123456');
    await userEvent.click(screen.getByRole('button', { name: '인증하기' }));

    await waitFor(() =>
      expect(onConfirmed).toHaveBeenCalledWith({
        phoneNumber: '01012345678',
        phoneIdToken: 'mock-phone-id-token',
      }),
    );
  });
});

describe('MemberReviewForm 컴포넌트 테스트', () => {
  it('휴대폰 인증 없이 회원 후기 작성 필드만 렌더링한다.', async () => {
    renderMemberReviewForm();

    expect(await screen.findByLabelText(/이름/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/휴대폰번호/)).not.toBeInTheDocument();
    expect(screen.queryByText(/개인정보 수집 및 이용에 동의합니다/)).not.toBeInTheDocument();
  });
});

describe('GuestReviewFormStep 컴포넌트 테스트', () => {
  it('다른 번호로 인증할 때 첨부 이미지를 비우고 인증 단계 전환을 요청한다.', async () => {
    const onRestartVerification = vi.fn();
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    queryClient.setQueryData(userKeys.all, mockNonUserData);

    renderWithQueryClient(
      <ImagesContext>
        <GuestImagesHarness onRestartVerification={onRestartVerification} />
      </ImagesContext>,
      { queryClient },
    );

    await waitFor(() => expect(screen.getByLabelText('첨부 이미지 수')).toHaveTextContent('1'));
    await userEvent.click(screen.getByRole('button', { name: '다른 번호로 인증' }));

    expect(screen.getByLabelText('첨부 이미지 수')).toHaveTextContent('0');
    expect(onRestartVerification).toHaveBeenCalledOnce();
  });
});

describe('ReviewFormPage 컴포넌트 테스트', () => {
  it('[회원] 이름 validation 테스트. 2글자 이상 20글자 이하 string만 가능하다.', async () => {
    renderReviewForm(mockUserData as IUserResponseData);

    // title은 제대로 입력
    await userEvent.type(await screen.findByLabelText(/제목/), 'This is a valid title');

    await selectFranchisee();

    // 이름에 1글자만 입력했을 때 제출 버튼 비활성화 확인
    await userEvent.type(screen.getByLabelText(/이름/), 'A');
    expect(screen.getByRole('button', { name: '후기 남기기' })).toBeDisabled();

    // 이름에 20글자 이상 입력했을 때 제출 버튼 비활성화 확인
    await userEvent.type(screen.getByLabelText(/이름/), '123456789012345678901');
    expect(screen.getByRole('button', { name: '후기 남기기' })).toBeDisabled();

    // 제대로 입력했을 때 제출 버튼 활성화 확인
    const nameInput = screen.getByLabelText(/이름/);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Valid Name');
    expect(screen.getByRole('button', { name: '후기 남기기' })).toBeEnabled();
  });

  it('[회원] title validation 테스트. 2자 이상 100자 이하로 입력해주세요.', async () => {
    renderReviewForm(mockUserData as IUserResponseData);

    // 이름은 제대로 입력
    await userEvent.type(await screen.findByLabelText(/이름/), 'Valid Name');

    await selectFranchisee();

    // 제목에 1글자만 입력했을 때 제출 버튼 비활성화 확인
    await userEvent.type(screen.getByLabelText(/제목/), 'A');
    expect(screen.getByRole('button', { name: '후기 남기기' })).toBeDisabled();

    // 제목에 100글자 이상 입력했을 때 제출 버튼 비활성화 확인
    await userEvent.type(
      screen.getByLabelText(/제목/),
      '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901',
    );
    expect(screen.getByRole('button', { name: '후기 남기기' })).toBeDisabled();

    // 제대로 입력했을 때 제출 버튼 활성화 확인
    const titleInput = screen.getByLabelText(/제목/);
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'This is a valid title');
    expect(screen.getByRole('button', { name: '후기 남기기' })).toBeEnabled();
  });

  it('[회원] 휴대폰번호/인증코드/개인정보 동의 입력창이 보이지 않는다.', async () => {
    renderReviewForm(mockUserData as IUserResponseData);

    await screen.findByLabelText(/이름/);
    expect(screen.queryByLabelText(/휴대폰번호/)).not.toBeInTheDocument();
    expect(screen.queryByText(/개인정보 수집 및 이용에 동의합니다/)).not.toBeInTheDocument();
  });

  it('[비회원] 휴대폰번호/인증코드/개인정보 동의 입력창이 보인다.', async () => {
    renderReviewForm(mockNonUserData);

    expect(await screen.findByLabelText(/휴대폰번호/)).toBeInTheDocument();
    expect(screen.getByText(/개인정보 수집 및 이용에 동의합니다/)).toBeInTheDocument();
    expect(screen.getByText(/동일한 대리점에는 24시간 내 1회만 후기를 작성할 수 있습니다\./)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '휴대폰 본인 인증' })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: '후기 작성 단계' })).toBeInTheDocument();
    expect(screen.getByText('본인 인증').closest('li')).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText('본인 인증').closest('li')).not.toHaveClass('flex-1');
    expect(screen.getByText('본인 인증').previousElementSibling).toHaveTextContent('1');
    expect(
      screen.getByRole('checkbox').compareDocumentPosition(screen.getByLabelText(/휴대폰번호/)) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.queryByLabelText(/이름/)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/제목/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '후기 남기기' })).not.toBeInTheDocument();
  });

  it('[비회원] 개인정보 동의 후에만 인증번호를 요청할 수 있다.', async () => {
    renderReviewForm(mockNonUserData);

    await userEvent.type(await screen.findByLabelText(/휴대폰번호/), '01012345678');
    const sendButton = screen.getByRole('button', { name: '인증받기' });
    expect(sendButton).toBeDisabled();

    fireEvent.click(screen.getByRole('checkbox'));
    await waitFor(() => expect(sendButton).toBeEnabled());
  });

  it('[비회원] SMS 인증 완료 후 제출 시 phoneIdToken이 포함된 페이로드로 API가 호출된다', async () => {
    const handler = vi.fn(async () => HttpResponse.json({ response: 'ok', message: '성공', docId: 'newDocId' }));
    server.use(http.post('/api/review/create', handler));

    renderReviewForm(mockNonUserData);
    await completeGuestVerification();

    expect(signInWithPhoneNumber).toHaveBeenCalled();
    const completedMarker = screen.getByLabelText('본인 인증 완료');
    expect(completedMarker).toHaveClass('bg-green-600', 'text-white');
    expect(completedMarker).not.toHaveTextContent('1');
    expect(completedMarker.querySelector('svg')).toBeInTheDocument();
    expect(screen.getByText(/010-\*{4}-5678/)).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText(/이름/), '홍길동');
    await userEvent.type(screen.getByLabelText(/제목/), '후기 제목입니다.');
    await selectFranchisee();

    const submitButton = screen.getByRole('button', { name: '후기 남기기' });
    await waitFor(() => expect(submitButton).toBeEnabled(), { timeout: 3000 });
    fireEvent.submit(submitButton.closest('form')!);

    await waitFor(async () => {
      expect(handler).toHaveBeenCalled();
      const req = handler.mock.calls as unknown as { request: Request }[][];
      const body = await req[0][0].request.json();
      expect(body.phoneIdToken).toBe('mock-phone-id-token');
    });
  });

  it('[비회원] 다른 번호로 인증하면 작성 상태를 폐기하고 인증부터 다시 시작한다.', async () => {
    renderReviewForm(mockNonUserData);
    await completeGuestVerification();
    await userEvent.type(screen.getByLabelText(/이름/), '폐기할 이름');
    await userEvent.type(screen.getByLabelText(/제목/), '폐기할 제목');

    await userEvent.click(screen.getByRole('button', { name: '다른 번호로 인증' }));
    expect(await screen.findByRole('heading', { name: '휴대폰 본인 인증' })).toBeInTheDocument();
    expect(screen.getByLabelText(/휴대폰번호/)).toHaveValue('');

    await completeGuestVerification('01087654321');
    expect(screen.getByLabelText(/이름/)).toHaveValue('');
    expect(screen.getByLabelText(/제목/)).toHaveValue('');
  });

  it('[회원] 제출 시 phoneIdToken 없이 API가 호출된다', async () => {
    const handler = vi.fn(async () => HttpResponse.json({ response: 'ok', message: '성공', docId: 'newDocId' }));
    server.use(http.post('/api/review/create', handler));

    renderReviewForm(mockUserData as IUserResponseData);

    await userEvent.type(await screen.findByLabelText(/이름/), 'Valid Name');
    await userEvent.type(screen.getByLabelText(/제목/), 'This is a valid title');
    await selectFranchisee();

    const submitButton = screen.getByRole('button', { name: '후기 남기기' });
    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.submit(submitButton.closest('form')!);

    await waitFor(async () => {
      expect(handler).toHaveBeenCalled();
      const req = handler.mock.calls as unknown as { request: Request }[][];
      const body = await req[0][0].request.json();
      expect(body.phoneIdToken).toBeUndefined();
    });
    expect(signInWithPhoneNumber).not.toHaveBeenCalled();
  });
});
