import { QueryClient } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Timestamp } from 'firebase/firestore';
import { http, HttpResponse } from 'msw';
import { Suspense } from 'react';

import { ReservationEditPage } from '@/app/reservation/edit/ui/ReservationEditPage';
import { server } from '@/src/__mock__/node';
import { reservationKeys, userKeys } from '@/src/shared/config/queryKeys';
import type { IReservationResponseData, IUserResponseData, TAliasAny } from '@/src/shared/types';
import * as utils from '@/src/shared/utils';
import { renderWithQueryClient } from '@/src/shared/utils/test/render';

const mockNonUserData: IUserResponseData = {
  response: 'ok',
  message: '성공',
  accessToken: null,
  userData: null,
  isLinked: false,
};

const docId = 'guest-doc-id';

const mockGuestReservationDetail: IReservationResponseData = {
  response: 'ok',
  message: '성공',
  data: {
    title: '기존 제목',
    name: '홍길동',
    secret: false,
    franchisee: '전체',
    phoneNumber: '01012345678',
    bornDate: null,
    location: '서울시 강남구',
    content: '기존 상담 내용',
    userId: null,
    password: '$2b$10$dummyHashValueForTestingPurposesOnly',
    isPinned: false,
    pinnedAt: null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    comments: null,
  },
};

const pushMock = vi.fn();
const replaceMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
  useSearchParams: () => new URLSearchParams({ docId }),
}));

vi.mock('react-google-recaptcha-v3', () => ({
  useGoogleReCaptcha: () => ({
    executeRecaptcha: () => Promise.resolve('recaptcha-token'),
  }),
}));

vi.mock('@/src/shared/ui/calendar', async () => {
  return {
    Calendar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

vi.mock('@/src/shared/ui/popover', async () => {
  return {
    Popover: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    PopoverTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    PopoverContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

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

vi.mock('@/src/shared/utils', async () => {
  const actual = await vi.importActual('@/src/shared/utils');
  return {
    ...actual,
    toastSuccess: vi.fn(),
    toastError: vi.fn(),
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

function renderEditPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(userKeys.all, mockNonUserData);
  queryClient.setQueryData(reservationKeys.detail(docId), mockGuestReservationDetail);

  return renderWithQueryClient(
    <Suspense fallback={null}>
      <ReservationEditPage docId={docId} />
    </Suspense>,
    { queryClient },
  );
}

describe('ReservationEdit Component', () => {
  it('[비회원] 기존 비밀번호와 새 비밀번호 입력창이 모두 보인다', async () => {
    renderEditPage();

    expect(await screen.findByLabelText(/기존 비밀번호/)).toBeInTheDocument();
    expect(screen.getByLabelText(/새 비밀번호/)).toBeInTheDocument();
  });

  it('[비회원] 기존 비밀번호를 입력하지 않으면 제출 버튼이 비활성화된다', async () => {
    renderEditPage();

    const submitButton = await screen.findByRole('button', { name: '수정완료' });
    await waitFor(() => expect(submitButton).toBeDisabled());

    const newPasswordInput = screen.getByLabelText(/새 비밀번호/);
    await userEvent.type(newPasswordInput, 'newpass5678');

    expect(submitButton).toBeDisabled();
  });

  it('제출 시 oldPassword가 포함된 페이로드로 /api/reservation/update가 호출된다', async () => {
    const handler = vi.fn(async () => HttpResponse.json({ response: 'ok', message: '성공' }));
    server.use(http.post('/api/reservation/update', handler));

    renderEditPage();

    const oldPasswordInput = await screen.findByLabelText(/기존 비밀번호/);
    const newPasswordInput = screen.getByLabelText(/새 비밀번호/);
    await userEvent.type(oldPasswordInput, 'oldpass1234');
    await userEvent.type(newPasswordInput, 'newpass5678');

    const submitButton = screen.getByRole('button', { name: '수정완료' });
    await waitFor(() => expect(submitButton).toBeEnabled());

    fireEvent.submit(submitButton.closest('form')!);

    await waitFor(async () => {
      expect(handler).toHaveBeenCalled();
      const req = handler.mock.calls as unknown as { request: Request }[][];
      const body = await req[0][0].request.json();
      expect(body.oldPassword).toBe('oldpass1234');
      expect(body.password).toBe('newpass5678');
    });
  });

  it('기존 비밀번호가 일치하지 않으면(401) 에러 토스트가 보인다', async () => {
    server.use(
      http.post('/api/reservation/update', async () =>
        HttpResponse.json({ response: 'ng', message: '기존 비밀번호가 일치하지 않습니다.' }, { status: 401 }),
      ),
    );

    renderEditPage();

    const oldPasswordInput = await screen.findByLabelText(/기존 비밀번호/);
    const newPasswordInput = screen.getByLabelText(/새 비밀번호/);
    await userEvent.type(oldPasswordInput, 'wrongpass');
    await userEvent.type(newPasswordInput, 'newpass5678');

    const submitButton = screen.getByRole('button', { name: '수정완료' });
    await waitFor(() => expect(submitButton).toBeEnabled());

    fireEvent.submit(submitButton.closest('form')!);

    await waitFor(() => {
      expect(utils.toastError).toHaveBeenCalledWith('상담 수정에 실패했습니다.');
    });
  });
});
