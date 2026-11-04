import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const storage = vi.hoisted(() => ({ get: vi.fn(), set: vi.fn() }));

vi.mock('next/image', () => ({ default: () => null }));
vi.mock('@/src/shared/storage', () => ({ safeLocalStorage: storage }));

import { EventModal } from '@/src/widgets/event/ui/EventModal';

describe('EventModal', () => {
  beforeEach(() => vi.clearAllMocks());

  it('오늘 하루 보지 않기 기간 중에는 모달을 열지 않는다', () => {
    storage.get.mockReturnValue(new Date(Date.now() + 60_000).toISOString());

    render(<EventModal />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('보지 않기 기록이 없으면 모달을 열고, 닫기 버튼 두 개만 보이며 포커스는 주지 않는다', async () => {
    storage.get.mockReturnValue(null);

    render(<EventModal />);

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '오늘 하루 보지 않기' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    expect(document.activeElement?.tagName).not.toBe('BUTTON');
  });

  it('닫기를 누르면 보지 않기 기록 없이 모달을 닫는다', async () => {
    storage.get.mockReturnValue(null);
    render(<EventModal />);

    fireEvent.click(await screen.findByRole('button', { name: '닫기' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(storage.set).not.toHaveBeenCalled();
  });

  it('오늘 하루 보지 않기를 누르면 내일까지 보지 않기 기록을 저장하고 닫는다', async () => {
    storage.get.mockReturnValue(null);
    render(<EventModal />);

    fireEvent.click(await screen.findByRole('button', { name: '오늘 하루 보지 않기' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    const [key, value] = storage.set.mock.calls[0];
    expect(key).toBe('hideUntilTime');
    expect(new Date(value).getTime()).toBeGreaterThan(Date.now() + 23 * 60 * 60 * 1000);
  });
});
