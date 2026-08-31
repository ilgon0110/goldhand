import { QueryClient } from '@tanstack/react-query';
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { RecaptchaVerifier } from 'firebase/auth';
import { signInWithPhoneNumber } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { http, HttpResponse } from 'msw';
import { Suspense, useEffect } from 'react';

import { ReviewEditPage } from '@/app/review/[docId]/edit/ui/ReviewEditPage';
import { server } from '@/src/__mock__/node';
import { mockUserData } from '@/src/__mock__/user';
import { reviewKeys, userKeys } from '@/src/shared/config/queryKeys';
import type { IReviewResponseData, IUserResponseData, TAliasAny } from '@/src/shared/types';
import { renderWithQueryClient } from '@/src/shared/utils/test/render';

const mockNonUserData: IUserResponseData = {
  response: 'ok',
  message: '성공',
  accessToken: null,
  userData: null,
  isLinked: false,
};

const replaceMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: replaceMock,
    refresh: vi.fn(),
  }),
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
  useMediaQuery: () => true,
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
  firebaseApp: { auth: vi.fn() },
}));

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

const docId = 'docId';

function makeReviewData(userId: string | null): IReviewResponseData {
  return {
    response: 'ok',
    message: 'ok',
    data: {
      thumbnail: null,
      htmlString: '<p>기존 내용</p>',
      createdAt: Timestamp.now(),
      franchisee: '전체',
      isPinned: false,
      pinnedAt: null,
      name: '홍길동',
      title: '기존 제목',
      updatedAt: Timestamp.now(),
      userId,
      phoneNumber: null,
      phoneHash: 'deadbeef',
      comments: [],
    },
  };
}

function renderReviewEdit(reviewUserId: string | null, viewerUserData: IUserResponseData) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(reviewKeys.detail(docId), makeReviewData(reviewUserId));
  queryClient.setQueryData(userKeys.all, viewerUserData);

  return renderWithQueryClient(
    <Suspense fallback={null}>
      <ReviewEditPage docId={docId} />
    </Suspense>,
    { queryClient },
  );
}

describe('ReviewEditPage 컴포넌트 테스트', () => {
  it('[회원 본인 글] 휴대폰 인증 필드 없이 기존 값이 채워진 채로 렌더링된다', async () => {
    renderReviewEdit(mockUserData.userData!.userId, mockUserData as IUserResponseData);

    expect(await screen.findByDisplayValue('기존 제목')).toBeInTheDocument();
    expect(screen.queryByLabelText(/휴대폰번호/)).not.toBeInTheDocument();
  });

  it('[비회원 글] 본인 인증을 Step 1로 표시하고 인증 전에는 수정 폼을 숨긴다', async () => {
    renderReviewEdit(null, mockNonUserData);

    expect(await screen.findByLabelText(/휴대폰번호/)).toBeInTheDocument();
    expect(screen.getByRole('list', { name: '후기 수정 단계' })).toBeInTheDocument();
    expect(screen.getByText('본인 인증').closest('li')).toHaveAttribute('aria-current', 'step');
    expect(screen.queryByLabelText(/제목/)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '후기 수정하기' })).not.toBeInTheDocument();
  });

  it('[관리자가 비회원 글 수정] 휴대폰 인증 필드가 보이지 않는다', async () => {
    const adminUserData: IUserResponseData = {
      response: 'ok',
      message: '성공',
      accessToken: 'token',
      isLinked: false,
      userData: { ...mockUserData.userData!, userId: 'admin-uid', grade: 'admin' },
    };
    renderReviewEdit(null, adminUserData);

    await screen.findByDisplayValue('기존 제목');
    expect(screen.queryByLabelText(/휴대폰번호/)).not.toBeInTheDocument();
  });

  it('[비회원 글] 인증한 번호가 작성 번호와 다르면 일반 오류를 표시하고 Step 1에 머문다', async () => {
    server.use(
      http.post('/api/review/verify-owner', () =>
        HttpResponse.json(
          { response: 'ng', message: '본인 확인에 실패했습니다. 입력 정보를 확인해주세요.' },
          { status: 403 },
        ),
      ),
    );

    renderReviewEdit(null, mockNonUserData);

    await userEvent.type(await screen.findByLabelText(/휴대폰번호/), '01087654321');
    await userEvent.click(screen.getByRole('button', { name: '인증받기' }));
    await userEvent.type(await screen.findByLabelText(/인증코드/), '123456');
    await userEvent.click(screen.getByRole('button', { name: '인증하기' }));

    expect(await screen.findByText('본인 확인에 실패했습니다. 입력 정보를 확인해주세요.')).toBeInTheDocument();
    expect(screen.getByText('본인 인증').closest('li')).toHaveAttribute('aria-current', 'step');
    expect(screen.queryByLabelText(/제목/)).not.toBeInTheDocument();
  });

  it('[비회원 글] SMS 인증 완료 후 제출하면 phoneIdToken이 포함된 페이로드로 API가 호출된다', async () => {
    const handler = vi.fn(async () => HttpResponse.json({ response: 'ok', message: '성공', docId }));
    server.use(
      http.post('/api/review/verify-owner', () =>
        HttpResponse.json({ response: 'ok', message: '본인 확인이 완료되었습니다.' }),
      ),
      http.post('/api/review/update', handler),
    );

    renderReviewEdit(null, mockNonUserData);

    await userEvent.type(await screen.findByLabelText(/휴대폰번호/), '01012345678');
    await userEvent.click(screen.getByRole('button', { name: '인증받기' }));
    expect(signInWithPhoneNumber).toHaveBeenCalled();

    const authCodeInput = await screen.findByLabelText(/인증코드/);
    await userEvent.type(authCodeInput, '123456');
    await userEvent.click(screen.getByRole('button', { name: '인증하기' }));
    await screen.findByDisplayValue('기존 제목');
    const stepper = screen.getByRole('list', { name: '후기 수정 단계' });
    expect(within(stepper).getByText('후기 수정').closest('li')).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText(/010-\*{4}-5678/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다시 인증' })).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: '후기 수정하기' });
    await waitFor(() => expect(submitButton).toBeEnabled(), { timeout: 3000 });
    fireEvent.submit(submitButton.closest('form')!);

    await waitFor(async () => {
      expect(handler).toHaveBeenCalled();
      const req = handler.mock.calls as unknown as { request: Request }[][];
      const body = await req[0][0].request.json();
      expect(body.phoneIdToken).toBe('mock-phone-id-token');
    });
  });
});
