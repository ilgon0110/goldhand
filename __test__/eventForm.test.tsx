import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { TAliasAny } from '@/src/shared/types';
import { renderWithQueryClient } from '@/src/shared/utils/test/render';
import { EventFormPage } from '@/src/views/event';

// useRouter 모킹
const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => '/review/form',
  useSearchParams: () => new URLSearchParams('mode=create'),
}));

vi.mock('@/src/widgets/editor/ui/Editor', () => {
  return {
    Editor: () => <div>Editor Mock Component</div>,
  };
});

// useAuthState가 정의된 경로를 정확히 입력하세요.
vi.mock('@/src/shared/hooks/useAuthState', () => ({
  useAuthState: () => ({
    isLinked: true, // 원하는 mock 값
    userData: { userId: 'mockUserId' }, // 원하는 mock 값
  }),
}));

vi.mock('@/src/shared/hooks/useMediaQuery', () => ({
  useMediaQuery: () => true, // 항상 데스크탑 뷰포트로 간주
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

describe('EventFormPage 컴포넌트 테스트', async () => {
  it('이름 validation 테스트. 2글자 이상 20글자 이하 string만 가능하다.', async () => {
    renderWithQueryClient(<EventFormPage />);

    // title은 제대로 입력
    await userEvent.type(screen.getByLabelText(/제목/), 'This is a valid title');

    // 이벤트 상태 선택
    const eventStatusTrigger = screen.getByTestId('event-status-select-trigger');
    await userEvent.click(eventStatusTrigger);
    const optionToSelect = await waitFor(() => screen.findByText(/진행중/, { selector: 'span' }));
    await userEvent.click(optionToSelect);

    // 이름에 1글자만 입력했을 때 제출 버튼 비활성화 확인
    await userEvent.type(screen.getByLabelText(/이름/), 'A');
    await userEvent.click(screen.getByRole('button', { name: '이벤트 만들기' }));

    expect(screen.getByRole('button', { name: '이벤트 만들기' })).toBeDisabled();

    // 이름에 20글자 이상 입력했을 때 제출 버튼 비활성화 확인
    await userEvent.type(screen.getByLabelText(/이름/), '123456789012345678901');
    expect(screen.getByRole('button', { name: '이벤트 만들기' })).toBeDisabled();

    // 제대로 입력했을 때 제출 버튼 활성화 확인
    const nameInput = screen.getByLabelText(/이름/);
    // Clear the input first
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Valid Name');
    expect(screen.getByRole('button', { name: '이벤트 만들기' })).toBeEnabled();
  });

  it('title validation 테스트. 2자 이상 100자 이하로 입력해주세요.', async () => {
    renderWithQueryClient(<EventFormPage />);

    // name은 제대로 입력
    await userEvent.type(screen.getByLabelText(/이름/), 'Valid Name');

    // 이벤트 상태 선택
    const eventStatusTrigger = screen.getByTestId('event-status-select-trigger');
    await userEvent.click(eventStatusTrigger);
    const optionToSelect = await waitFor(() => screen.findByText(/진행중/, { selector: 'span' }));
    await userEvent.click(optionToSelect);

    // title에 1글자만 입력했을 때 제출 버튼 비활성화 확인
    await userEvent.type(screen.getByLabelText(/제목/), 'A');
    await userEvent.click(screen.getByRole('button', { name: '이벤트 만들기' }));

    expect(screen.getByRole('button', { name: '이벤트 만들기' })).toBeDisabled();

    // title에 100글자 이상 입력했을 때 제출 버튼 비활성화 확인
    await userEvent.type(
      screen.getByLabelText(/제목/),
      '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901',
    );
    expect(screen.getByRole('button', { name: '이벤트 만들기' })).toBeDisabled();

    // 제대로 입력했을 때 제출 버튼 활성화 확인
    const titleInput = screen.getByLabelText(/제목/);
    // Clear the input first
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Valid Title');
    expect(screen.getByRole('button', { name: '이벤트 만들기' })).toBeEnabled();
  });

  it('이벤트 상태 Select 테스트. 올바르게 선택되는지 확인합니다.', async () => {
    renderWithQueryClient(<EventFormPage />);

    const eventStatusTrigger = screen.getByTestId('event-status-select-trigger');
    await userEvent.click(eventStatusTrigger);

    const upcomingOption = await waitFor(() => screen.findByText(/예정됨/, { selector: 'span' }));

    // '예정' 옵션 선택
    await userEvent.click(upcomingOption);
    expect(screen.getByTestId('event-status-select-trigger')).toHaveTextContent('예정됨');
  });

  it('필수 입력값들을 제대로 입력했을 때 제출 버튼이 활성화 되는지 확인합니다.', async () => {
    renderWithQueryClient(<EventFormPage />);

    // 이름 입력
    await userEvent.type(screen.getByLabelText(/이름/), 'Valid Name');

    // 제목 입력
    await userEvent.type(screen.getByLabelText(/제목/), 'Valid Title');

    // 이벤트 상태 선택
    const eventStatusTrigger = screen.getByTestId('event-status-select-trigger');
    await userEvent.click(eventStatusTrigger);
    const optionToSelect = await waitFor(() => screen.findByText(/진행중/, { selector: 'span' }));
    await userEvent.click(optionToSelect);

    // 제출 버튼이 활성화 되었는지 확인
    expect(screen.getByRole('button', { name: '이벤트 만들기' })).toBeEnabled();
  });

  it('이름을 잘못 입력했을 때 제출 버튼이 비활성화 되는지 확인합니다.', async () => {
    renderWithQueryClient(<EventFormPage />);

    // 이름 입력 (잘못된 값)
    await userEvent.type(screen.getByLabelText(/이름/), 'A');

    // 제목 입력
    await userEvent.type(screen.getByLabelText(/제목/), 'Valid Title');

    // 이벤트 상태 선택
    const eventStatusTrigger = screen.getByTestId('event-status-select-trigger');
    await userEvent.click(eventStatusTrigger);
    const optionToSelect = await waitFor(() => screen.findByText(/진행중/, { selector: 'span' }));
    await userEvent.click(optionToSelect);

    // 제출 버튼이 비활성화 되었는지 확인
    expect(screen.getByRole('button', { name: '이벤트 만들기' })).toBeDisabled();
  });

  it('제목을 잘못 입력했을 때 제출 버튼이 비활성화 되는지 확인합니다.', async () => {
    renderWithQueryClient(<EventFormPage />);

    // 이름 입력
    await userEvent.type(screen.getByLabelText(/이름/), 'Valid Name');

    // 제목 입력
    await userEvent.type(screen.getByLabelText(/제목/), 'Invalid Title. '.repeat(10)); // 100자 초과

    // 이벤트 상태 선택
    const eventStatusTrigger = screen.getByTestId('event-status-select-trigger');
    await userEvent.click(eventStatusTrigger);
    const optionToSelect = await waitFor(() => screen.findByText(/진행중/, { selector: 'span' }));
    await userEvent.click(optionToSelect);

    // 제출 버튼이 비활성화 되었는지 확인
    expect(screen.getByRole('button', { name: '이벤트 만들기' })).toBeDisabled();
  });

  it('이벤트 상태를 선택하지 않았을 때 제출 버튼이 비활성화 되는지 확인합니다.', async () => {
    renderWithQueryClient(<EventFormPage />);

    // 이름 입력
    await userEvent.type(screen.getByLabelText(/이름/), 'Valid Name');

    // 제목 입력
    await userEvent.type(screen.getByLabelText(/제목/), 'Invalid Title. '.repeat(10)); // 100자 초과

    // 이벤트 상태 선택 안함

    // 제출 버튼이 비활성화 되었는지 확인
    expect(screen.getByRole('button', { name: '이벤트 만들기' })).toBeDisabled();
  });
});
