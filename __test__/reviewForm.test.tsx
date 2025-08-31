import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ReviewFormPage } from '@/src/views/review';

// useRouter 모킹
const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
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

describe('ReviewFormPage 컴포넌트 테스트', async () => {
  it('이름 validation 테스트. 2글자 이상 20글자 이하 string만 가능하다.', async () => {
    render(<ReviewFormPage />);

    // title은 제대로 입력
    await userEvent.type(screen.getByLabelText(/제목/), 'This is a valid title');

    // 대리점 선택
    await userEvent.click(screen.getByTestId('franchisee-select-trigger'));
    await userEvent.click(screen.getByText(/전체/));

    // 이름에 1글자만 입력했을 때 제출 버튼 비활성화 확인
    await userEvent.type(screen.getByLabelText(/이름/), 'A');
    await userEvent.click(screen.getByRole('button', { name: '후기 남기기' }));

    expect(screen.getByRole('button', { name: '후기 남기기' })).toBeDisabled();

    // 이름에 20글자 이상 입력했을 때 제출 버튼 비활성화 확인
    await userEvent.type(screen.getByLabelText(/이름/), '123456789012345678901');
    expect(screen.getByRole('button', { name: '후기 남기기' })).toBeDisabled();

    // 제대로 입력했을 때 제출 버튼 활성화 확인
    const nameInput = screen.getByLabelText(/이름/);
    // Clear the input first
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Valid Name');
    expect(screen.getByRole('button', { name: '후기 남기기' })).toBeEnabled();
  });

  it('title validation 테스트. 2자 이상 100자 이하로 입력해주세요.', async () => {
    render(<ReviewFormPage />);

    // 이름은 제대로 입력
    await userEvent.type(screen.getByLabelText(/이름/), 'Valid Name');

    // 대리점 선택
    await userEvent.click(screen.getByTestId('franchisee-select-trigger'));
    await userEvent.click(screen.getByText(/전체/));

    // 제목에 1글자만 입력했을 때 제출 버튼 비활성화 확인
    await userEvent.type(screen.getByLabelText(/제목/), 'A');
    await userEvent.click(screen.getByRole('button', { name: '후기 남기기' }));

    expect(screen.getByRole('button', { name: '후기 남기기' })).toBeDisabled();

    // 제목에 100글자 이상 입력했을 때 제출 버튼 비활성화 확인
    await userEvent.type(
      screen.getByLabelText(/제목/),
      '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901',
    );
    expect(screen.getByRole('button', { name: '후기 남기기' })).toBeDisabled();

    // 제대로 입력했을 때 제출 버튼 활성화 확인
    const titleInput = screen.getByLabelText(/제목/);
    // Clear the input first
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'This is a valid title');
    expect(screen.getByRole('button', { name: '후기 남기기' })).toBeEnabled();
  });
});
