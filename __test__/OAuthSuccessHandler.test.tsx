import { render, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { OAuthSuccessHandler } from '@/src/shared/ui/OAuthSuccessHandler';

const storage = vi.hoisted(() => ({ set: vi.fn() }));
const toastSuccess = vi.hoisted(() => vi.fn());

vi.mock('@/src/shared/storage', () => ({ safeLocalStorage: storage }));
vi.mock('@/src/shared/utils', () => ({ toastSuccess }));

describe('OAuthSuccessHandler', () => {
  it('handles the Kakao success query in the browser and removes it from the URL', async () => {
    window.history.replaceState(null, '', '/?kakao_success=true');
    const onLocationChange = vi.fn();
    window.addEventListener('goldhand:locationchange', onLocationChange);

    try {
      render(<OAuthSuccessHandler />);

      await waitFor(() => {
        expect(toastSuccess).toHaveBeenCalledWith('로그인에 성공했습니다!');
      });

      expect(storage.set).toHaveBeenCalledWith('last-login-tooltip', 'kakao');
      expect(window.location.pathname).toBe('/');
      expect(window.location.search).toBe('');
      expect(onLocationChange).toHaveBeenCalledTimes(1);
    } finally {
      window.removeEventListener('goldhand:locationchange', onLocationChange);
    }
  });
});
