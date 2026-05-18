import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { ReservationFormPage } from '@/app/reservation/form/ui/ReservationFormPage';
import { server } from '@/src/__mock__/node';
import { mockUserData } from '@/src/__mock__/user';
import type { IUserResponseData, TAliasAny } from '@/src/shared/types';
import * as utils from '@/src/shared/utils';
import { renderWithQueryClient } from '@/src/shared/utils/test/render';

const mockNonUserData: IUserResponseData = {
  response: 'ok',
  message: '성공',
  accessToken: null,
  userData: null,
  isLinked: false,
};

// 라우터 mock
const pushMock = vi.fn();
const replaceMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
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
        // checked와 defaultChecked를 동시에 넘기지 않음
        {...(checked !== undefined ? { checked } : { defaultChecked })}
        onChange={e => onCheckedChange?.(e.target.checked)}
        {...props}
      />
    ),
  };
});

vi.mock('@/src/shared/utils', async () => {
  // 원본 모듈 import
  const actual = await vi.importActual('@/src/shared/utils');
  return {
    ...actual,
    toastSuccess: vi.fn(),
    toastError: vi.fn(),
  };
});

vi.mock('@/src/entities/reservation', async () => {
  const actual = await vi.importActual('@/src/entities/reservation');
  return {
    ...actual,
    passwordPostAction: vi.fn().mockResolvedValue({ response: 'ok', message: '성공' }),
  };
});

vi.mock('@/src/shared/utils/verifyViewId', async () => {
  const actual = await vi.importActual('@/src/shared/utils/verifyViewId');
  return {
    ...actual,
    sendViewLog: vi.fn().mockResolvedValue({ response: 'ok', message: '성공' }),
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

describe('ReservationForm Component', () => {
  it('대리점 선택 Select 클릭 시 옵션이 제대로 선택되는지 확인', async () => {
    const userData = await (await fetch('/api/user')).json();
    renderWithQueryClient(<ReservationFormPage userData={userData} />);

    const franchiseeTrigger = screen.getByTestId('franchisee-select-trigger');
    await userEvent.click(franchiseeTrigger);
    const optionToSelect = await waitFor(() => screen.findByText(/전체/, { selector: 'span' }));

    await userEvent.click(optionToSelect);
    expect(franchiseeTrigger).toHaveTextContent('전체');
  });

  it('[비회원] 비회원인 경우에만 비밀번호 입력창이 보인다.', async () => {
    const ReservationApplyPage = (await import('@/app/reservation/apply/page')).default;
    renderWithQueryClient(<ReservationApplyPage />);

    const nonMemberLink = screen.getByRole('link', { name: '비회원으로 문의하기' });
    expect(nonMemberLink).toHaveAttribute('href', '/reservation/form');

    renderWithQueryClient(<ReservationFormPage userData={mockNonUserData} />);
    expect(screen.queryByLabelText(/비밀번호/)).toBeInTheDocument();
  });

  it('[회원] 필수 입력값이 모두 입력되어야 제출 버튼이 활성화된다.', async () => {
    const user = userEvent.setup();
    const userData = await (await fetch('/api/user')).json();
    renderWithQueryClient(<ReservationFormPage userData={userData} />);

    const titleInput = screen.getByLabelText(/제목/);
    const serviceAreaInput = screen.getByLabelText(/서비스 이용 지역/);
    const contentInput = screen.getByLabelText(/상담 내용/);
    const submitButton = screen.getByRole('button', { name: '상담 신청하기' });

    expect(submitButton).toBeDisabled();
    const franchiseeTrigger = screen.getByTestId('franchisee-select-trigger');
    await user.click(franchiseeTrigger);
    const optionToSelect = await waitFor(() => screen.findByText(/전체/, { selector: 'span' }));

    await user.click(optionToSelect);
    expect(franchiseeTrigger).toHaveTextContent('전체');

    await userEvent.type(titleInput, '예약 문의합니다.');
    await userEvent.type(serviceAreaInput, '서울시 강남구');
    await userEvent.type(contentInput, '예약 문의합니다.');

    expect(submitButton).toBeEnabled();
  });

  it('제출 버튼을 눌렀을 때, 제출이 성공하면 /reservation/list로 이동하는지 확인', async () => {
    const handler = vi.fn(async () => {
      return HttpResponse.json({ response: 'ok', message: '성공', docId: 'newDocId' });
    });
    server.use(
      http.get('/api/user', async () => HttpResponse.json(mockNonUserData)),
      http.post('/api/reservation/create', handler),
    );
    const userData = await (await fetch('/api/user')).json();
    renderWithQueryClient(<ReservationFormPage userData={userData} />);

    const nameInput = screen.getByLabelText(/이름/);
    const phoneInput = screen.getByLabelText(/휴대폰번호/);
    const passwordInput = screen.getByLabelText(/비밀번호/);
    const titleInput = screen.getByLabelText(/제목/);
    const serviceAreaInput = screen.getByLabelText(/서비스 이용 지역/);
    const contentInput = screen.getByLabelText(/상담 내용/);
    const submitButton = screen.getByRole('button', { name: '상담 신청하기' });

    expect(submitButton).toBeDisabled();

    await userEvent.type(nameInput, '홍길동');
    await userEvent.type(phoneInput, '01012345678');
    await userEvent.type(passwordInput, '1234');

    const franchiseeTrigger = screen.getByTestId('franchisee-select-trigger');
    await userEvent.click(franchiseeTrigger);
    const optionToSelect = await waitFor(() => screen.findByText(/전체/, { selector: 'span' }));
    await userEvent.click(optionToSelect);
    expect(franchiseeTrigger).toHaveTextContent('전체');

    await userEvent.type(titleInput, '예약 문의합니다.');
    await userEvent.type(serviceAreaInput, '서울시 강남구');
    await userEvent.type(contentInput, '예약 문의합니다.');

    expect(submitButton).toBeEnabled();
    const form = screen.getByRole('form', { name: '상담신청폼' });
    fireEvent.submit(form);

    await waitFor(
      () => {
        expect(replaceMock).toHaveBeenCalledWith('/reservation/list/newDocId');
      },
      { timeout: 4000 },
    );
  });

  it('제출 버튼을 눌렀을 때, 예약 API가 호출되는지 확인', async () => {
    const handler = vi.fn(async () => {
      return HttpResponse.json({ response: 'ok', message: '성공', newDocId: 'newDocId' });
    });
    server.use(
      http.get('/api/user', async () => HttpResponse.json(mockUserData)),
      http.post('/api/reservation/create', handler),
    );

    const userData = await (await fetch('/api/user')).json();
    renderWithQueryClient(<ReservationFormPage userData={userData} />);

    const titleInput = screen.getByLabelText(/제목/);
    const serviceAreaInput = screen.getByLabelText(/서비스 이용 지역/);
    const contentInput = screen.getByLabelText(/상담 내용/);
    const submitButton = screen.getByRole('button', { name: '상담 신청하기' });

    expect(submitButton).toBeDisabled();

    const franchiseeTrigger = screen.getByTestId('franchisee-select-trigger');
    await userEvent.click(franchiseeTrigger);
    const optionToSelect = await waitFor(() => screen.findByText(/전체/, { selector: 'span' }));

    await userEvent.click(optionToSelect);
    expect(franchiseeTrigger).toHaveTextContent('전체');
    await userEvent.type(titleInput, '예약 문의합니다.');
    await userEvent.type(serviceAreaInput, '서울시 강남구');
    await userEvent.type(contentInput, '예약 문의합니다.');

    expect(submitButton).toBeEnabled();
    const form = screen.getByRole('form', { name: '상담신청폼' });
    fireEvent.submit(form);

    await waitFor(async () => {
      expect(handler).toHaveBeenCalled();
      const req = handler.mock.calls as unknown as { request: Request }[][];
      const target = req[0][0];
      expect(target.request.url).toContain('/api/reservation/create');
    });
  });

  it('제출 버튼을 눌렀을 때, 제출 도중 user session이 만료된 경우 해당 에러 메세지가 보이고 /login으로 이동하는지 확인', async () => {
    const userData = await (await fetch('/api/user')).json();
    renderWithQueryClient(<ReservationFormPage userData={userData} />);

    const titleInput = screen.getByLabelText(/제목/);
    const serviceAreaInput = screen.getByLabelText(/서비스 이용 지역/);
    const contentInput = screen.getByLabelText(/상담 내용/);
    const submitButton = screen.getByRole('button', { name: '상담 신청하기' });

    expect(submitButton).toBeDisabled();

    const franchiseeTrigger = screen.getByTestId('franchisee-select-trigger');
    await userEvent.click(franchiseeTrigger);
    const optionToSelect = await waitFor(() => screen.findByText(/전체/, { selector: 'span' }));
    await userEvent.click(optionToSelect);
    expect(franchiseeTrigger).toHaveTextContent('전체');

    await userEvent.type(titleInput, '예약 문의합니다.');
    await userEvent.type(serviceAreaInput, '서울시 강남구');
    await userEvent.type(contentInput, '예약 문의합니다.');

    expect(submitButton).toBeEnabled();

    server.use(
      http.post('/api/reservation/create', async () =>
        HttpResponse.json({ response: 'ng', message: '서버 오류가 발생했습니다.' }, { status: 500 }),
      ),
    );

    const form = screen.getByRole('form', { name: '상담신청폼' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(utils.toastError).toHaveBeenCalledWith('상담 신청에 실패했습니다.');
    });
  });

  it('[비회원] 필수 입력값이 모두 입력되어야 제출 버튼이 활성화된다.', async () => {
    server.use(http.get(`/api/user`, async () => HttpResponse.json(mockNonUserData)));
    const userData = await (await fetch('/api/user')).json();
    renderWithQueryClient(<ReservationFormPage userData={userData} />);

    const nameInput = screen.getByLabelText(/이름/);
    const phoneInput = screen.getByLabelText(/휴대폰번호/);
    const passwordInput = screen.getByLabelText(/비밀번호/);
    const titleInput = screen.getByLabelText(/제목/);
    const serviceAreaInput = screen.getByLabelText(/서비스 이용 지역/);
    const contentInput = screen.getByLabelText(/상담 내용/);
    const submitButton = screen.getByRole('button', { name: '상담 신청하기' });

    expect(submitButton).toBeDisabled();

    await userEvent.type(nameInput, '홍길동');
    await userEvent.type(phoneInput, '01012345678');
    await userEvent.type(passwordInput, '1234');
    const franchiseeTrigger = screen.getByTestId('franchisee-select-trigger');
    await userEvent.click(franchiseeTrigger);
    const optionToSelect = await waitFor(() => screen.findByText(/전체/, { selector: 'span' }));

    await userEvent.click(optionToSelect);
    expect(franchiseeTrigger).toHaveTextContent('전체');

    await userEvent.type(titleInput, '예약 문의합니다.');
    await userEvent.type(serviceAreaInput, '서울시 강남구');
    await userEvent.type(contentInput, '예약 문의합니다.');

    expect(submitButton).toBeEnabled();
  });

  it('제출 버튼을 눌렀을 때, 제출이 실패하면 에러 메세지가 보이는지 확인', async () => {
    const handler = vi.fn(async () => {
      return HttpResponse.json({ response: 'ng', message: '어떤 이유로 인해 실패했습니다.' }, { status: 500 });
    });
    server.use(
      http.get('/api/user', async () => HttpResponse.json(mockNonUserData)),
      http.post('/api/reservation/create', handler),
    );
    const userData = await (await fetch('/api/user')).json();
    renderWithQueryClient(<ReservationFormPage userData={userData} />);

    const nameInput = screen.getByLabelText(/이름/);
    const phoneInput = screen.getByLabelText(/휴대폰번호/);
    const passwordInput = screen.getByLabelText(/비밀번호/);
    const titleInput = screen.getByLabelText(/제목/);
    const serviceAreaInput = screen.getByLabelText(/서비스 이용 지역/);
    const contentInput = screen.getByLabelText(/상담 내용/);
    const submitButton = screen.getByRole('button', { name: '상담 신청하기' });

    expect(submitButton).toBeDisabled();

    await userEvent.type(nameInput, '홍길동');
    await userEvent.type(phoneInput, '01012345678');
    await userEvent.type(passwordInput, '1234');

    const franchiseeTrigger = screen.getByTestId('franchisee-select-trigger');
    await userEvent.click(franchiseeTrigger);
    const optionToSelect = await waitFor(() => screen.findByText(/전체/, { selector: 'span' }));
    await userEvent.click(optionToSelect);
    expect(franchiseeTrigger).toHaveTextContent('전체');

    await userEvent.type(titleInput, '예약 문의합니다.');
    await userEvent.type(serviceAreaInput, '서울시 강남구');
    await userEvent.type(contentInput, '예약 문의합니다.');

    expect(submitButton).toBeEnabled();
    const form = screen.getByRole('form', { name: '상담신청폼' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(utils.toastError).toHaveBeenCalledWith('상담 신청에 실패했습니다.');
    });
  });
});
