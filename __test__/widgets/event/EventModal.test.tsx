import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const storage = vi.hoisted(() => ({ get: vi.fn(), set: vi.fn() }));

vi.mock('next/image', () => ({ default: () => null }));
vi.mock('@/src/shared/storage', () => ({ safeLocalStorage: storage }));

import { EventModal } from '@/src/widgets/event/ui/EventModal';

describe('EventModal', () => {
  beforeEach(() => vi.clearAllMocks());

  it('keeps the modal closed while the dismissal window is active', () => {
    storage.get.mockReturnValue(new Date(Date.now() + 60_000).toISOString());

    render(<EventModal />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens centered dialog with both close actions visible', async () => {
    storage.get.mockReturnValue(null);

    render(<EventModal />);

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '오늘 하루 보지 않기' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    expect(document.activeElement?.tagName).not.toBe('BUTTON');
  });

  it('closes on 닫기 without storing a dismissal window', async () => {
    storage.get.mockReturnValue(null);
    render(<EventModal />);

    fireEvent.click(await screen.findByRole('button', { name: '닫기' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(storage.set).not.toHaveBeenCalled();
  });

  it('stores a dismissal window until tomorrow on 오늘 하루 보지 않기', async () => {
    storage.get.mockReturnValue(null);
    render(<EventModal />);

    fireEvent.click(await screen.findByRole('button', { name: '오늘 하루 보지 않기' }));

    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    const [key, value] = storage.set.mock.calls[0];
    expect(key).toBe('hideUntilTime');
    expect(new Date(value).getTime()).toBeGreaterThan(Date.now() + 23 * 60 * 60 * 1000);
  });
});
