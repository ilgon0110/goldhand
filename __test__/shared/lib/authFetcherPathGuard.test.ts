import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/headers', () => ({
  headers: () => new Headers({ cookie: 'session=abc' }),
}));

import { authFetcher } from '@/src/shared/utils/fetcher.server';

describe('authFetcher path guard', () => {
  afterEach(() => vi.unstubAllGlobals());

  it.each(['@169.254.169.254/latest/meta-data/', '//evil.com/x', 'http://evil.com', '/_next/x'])(
    '%s 경로는 fetch 없이 거부한다',
    async path => {
      const fetchMock = vi.fn();
      vi.stubGlobal('fetch', fetchMock);

      await expect(authFetcher(path)).rejects.toThrow('허용되지 않은 요청 경로입니다.');
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it('/api/ 경로는 그대로 요청한다', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: 1 }), { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(authFetcher('/api/user')).resolves.toEqual({ ok: 1 });
    expect(String(fetchMock.mock.calls[0][0])).toMatch(/\/api\/user$/);
  });
});
