import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const storage = vi.hoisted(() => ({ get: vi.fn(), set: vi.fn() }));

vi.mock('next/image', () => ({ default: () => null }));
vi.mock('@/src/shared/storage', () => ({ safeLocalStorage: storage }));
vi.mock('@/src/shared/ui/AnimateModal', () => ({
  AnimateModal: ({ isOpen }: { isOpen: boolean }) => <div data-open={isOpen} data-testid="event-modal" />,
}));

import { EventModal } from '@/src/widgets/event/ui/EventModal';

describe('EventModal', () => {
  it('keeps the modal closed while the dismissal window is active', async () => {
    storage.get.mockReturnValue(new Date(Date.now() + 60_000).toISOString());

    render(<EventModal />);

    await waitFor(() => {
      expect(screen.getByTestId('event-modal')).toHaveAttribute('data-open', 'false');
    });
  });

  it('opens the modal when no dismissal window is stored', async () => {
    storage.get.mockReturnValue(null);

    render(<EventModal />);

    await waitFor(() => {
      expect(screen.getByTestId('event-modal')).toHaveAttribute('data-open', 'true');
    });
  });
});
