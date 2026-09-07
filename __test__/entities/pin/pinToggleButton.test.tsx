/* eslint-disable react/jsx-handler-names */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PinToggleButton } from '@/src/entities/pin';

describe('PinToggleButton', () => {
  it('admin이 아니고 고정되지 않은 경우 아무것도 렌더링하지 않는다', () => {
    render(<PinToggleButton isAdmin={false} isPinned={false} onToggle={() => {}} />);
    expect(screen.queryByTestId('pin-badge')).not.toBeInTheDocument();
    expect(screen.queryByTestId('pin-toggle-button')).not.toBeInTheDocument();
  });

  it('admin이 아니고 고정된 경우 배지만 렌더링하고 버튼은 없다', () => {
    render(<PinToggleButton isAdmin={false} isPinned={true} onToggle={() => {}} />);
    expect(screen.getByTestId('pin-badge')).toBeInTheDocument();
    expect(screen.queryByTestId('pin-toggle-button')).not.toBeInTheDocument();
  });

  it('admin인 경우 고정 여부와 무관하게 토글 버튼을 렌더링한다', () => {
    render(<PinToggleButton isAdmin={true} isPinned={false} onToggle={() => {}} />);
    expect(screen.getByTestId('pin-toggle-button')).toBeInTheDocument();
  });

  it('admin이 토글 버튼을 클릭하면 onToggle이 호출된다', async () => {
    const onToggle = vi.fn();
    render(<PinToggleButton isAdmin={true} isPinned={false} onToggle={onToggle} />);
    await userEvent.click(screen.getByTestId('pin-toggle-button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
