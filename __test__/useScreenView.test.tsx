import { renderHook, waitFor } from '@testing-library/react';
import { logEvent } from 'firebase/analytics';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { firebaseAnalyticsPromise } from '@/src/shared/config/firebase';
import { useScreenView } from '@/src/shared/hooks/useScreenView';
// firebaseAnalyticsPromise와 logEvent를 모킹
vi.mock('@/src/shared/config/firebase', () => ({
  firebaseAnalyticsPromise: Promise.resolve({ analytics: true }),
}));

vi.mock('firebase/analytics', () => {
  const original = vi.importActual('firebase/analytics');

  return {
    ...original,
    // logEvent를 모킹하여 테스트에서 호출 여부를 확인할 수 있도록}
    logEvent: vi.fn(),
  };
});

describe('useScreenView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('screenName과 screenClass가 있으면 logEvent 호출', async () => {
    renderHook(() => useScreenView('reservation_detail_123', 'ReservationDetailPage', { doc_id: '123' }));

    // firebaseAnalyticsPromise가 resolve될 때까지 대기
    await firebaseAnalyticsPromise;

    expect(logEvent).toHaveBeenCalledWith(
      { analytics: true },
      'screen_view',
      expect.objectContaining({
        firebase_screen: 'reservation_detail_123',
        firebase_screen_class: 'ReservationDetailPage',
        doc_id: '123',
      }),
    );
  });

  it('screenName이 없으면 logEvent 호출 안 함', async () => {
    renderHook(() => useScreenView('', 'Page'));

    await firebaseAnalyticsPromise;

    expect(logEvent).not.toHaveBeenCalled();
  });

  it('screenClass가 없으면 logEvent 호출 안 함', async () => {
    renderHook(() => useScreenView('Page', ''));

    await firebaseAnalyticsPromise;

    expect(logEvent).not.toHaveBeenCalled();
  });

  it('screenName과 screenClass가 있어도 파라미터가 변하지 않으면 logEvent 호출 안 함', async () => {
    const { useScreenView } = await import('@/src/shared/hooks/useScreenView');
    const { rerender } = renderHook(({ screenName, screenClass }) => useScreenView(screenName, screenClass), {
      initialProps: { screenName: 'Page', screenClass: 'PageClass' },
    });

    // 첫 번째 effect 실행까지 대기
    await waitFor(() => {
      expect(logEvent).toHaveBeenCalledTimes(1);
    });

    // 동일한 파라미터로 다시 렌더링
    rerender({ screenName: 'Page', screenClass: 'PageClass' });

    // 호출 횟수가 그대로 1인지 확인 (추가 호출 없어야 함)
    await waitFor(() => {
      expect(logEvent).toHaveBeenCalledTimes(1);
    });
  });

  it('screenName과 screenClass가 있고 파라미터가 변하면 logEvent 호출', async () => {
    const { useScreenView } = await import('@/src/shared/hooks/useScreenView');
    const { rerender } = renderHook(({ screenName, screenClass }) => useScreenView(screenName, screenClass), {
      initialProps: { screenName: 'Page', screenClass: 'PageClass' },
    });

    // 첫 번째 effect 실행까지 대기
    await waitFor(() => {
      expect(logEvent).toHaveBeenCalledTimes(1);
    });

    // 동일한 파라미터로 다시 렌더링
    rerender({ screenName: 'Page', screenClass: 'Diff' });

    // 호출 횟수가 2인지 확인 (추가 호출 있어야 함)
    await waitFor(() => {
      expect(logEvent).toHaveBeenCalledTimes(2);
    });
  });
});
