import type { ComponentType } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const storage = vi.hoisted(() => ({ get: vi.fn(), set: vi.fn() }));

vi.mock('next/image', () => ({ default: () => null }));
vi.mock('@/src/shared/storage', () => ({ safeLocalStorage: storage }));
vi.mock('@/src/shared/ui/AnimateModal', () => ({
  AnimateModal: ({ isOpen }: { isOpen: boolean }) => <div data-open={isOpen} data-testid="event-modal" />,
}));

import { EventModal } from '@/src/widgets/event/ui/EventModal';

const EventModalWithLocation = EventModal as ComponentType<{ locationKey: string }>;

describe('EventModal', () => {
  it('reevaluates the dismissal window when its server-derived location key changes', async () => {
    storage.get.mockReturnValue(new Date(Date.now() + 60_000).toISOString());

    const { rerender } = render(<EventModalWithLocation locationKey="" />);

    await waitFor(() => {
      expect(screen.getByTestId('event-modal')).toHaveAttribute('data-open', 'false');
    });

    storage.get.mockReturnValue(null);
    rerender(<EventModalWithLocation locationKey="source=header" />);

    await waitFor(() => {
      expect(screen.getByTestId('event-modal')).toHaveAttribute('data-open', 'true');
    });
  });

  it.each([
    ['the OAuth location-change event', () => window.dispatchEvent(new Event('goldhand:locationchange'))],
    ['browser back or forward navigation', () => window.dispatchEvent(new PopStateEvent('popstate'))],
  ])('reevaluates the dismissal window after %s', async (_reason, notifyLocationChange) => {
    storage.get.mockReturnValue(new Date(Date.now() + 60_000).toISOString());

    render(<EventModalWithLocation locationKey="" />);

    await waitFor(() => {
      expect(screen.getByTestId('event-modal')).toHaveAttribute('data-open', 'false');
    });

    storage.get.mockReturnValue(null);
    act(notifyLocationChange);

    await waitFor(() => {
      expect(screen.getByTestId('event-modal')).toHaveAttribute('data-open', 'true');
    });
  });
});
