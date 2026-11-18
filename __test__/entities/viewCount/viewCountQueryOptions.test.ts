import { describe, expect, it } from 'vitest';

import { viewCountQueryOptions } from '@/src/entities/viewCount/api/useGetViewCountData';

const runQueryFn = (res: Response) => {
  const { queryFn } = viewCountQueryOptions('doc1', async () => res);
  return (queryFn as () => Promise<unknown>)();
};

describe('viewCountQueryOptions', () => {
  it('200이면 조회수를 반환한다', async () => {
    await expect(
      runQueryFn(Response.json({ response: 'ok', message: '', data: { totalViewCount: 3 } })),
    ).resolves.toMatchObject({ data: { totalViewCount: 3 } });
  });

  it.each([
    ['404', Response.json({ response: 'ng', message: 'no such document', data: null }, { status: 404 })],
    ['500', Response.json({ response: 'ng', message: 'Error', data: null }, { status: 500 })],
    ['502 HTML', new Response('<html>Bad Gateway</html>', { status: 502 })],
  ])('%s여도 throw하지 않고 data: null을 반환해 상세 페이지를 깨뜨리지 않는다', async (_, res) => {
    await expect(runQueryFn(res)).resolves.toMatchObject({ data: null });
  });

  it('네트워크 에러여도 throw하지 않는다 (스트리밍 쿼리라 throw하면 Error Boundary가 필요해짐)', async () => {
    const { queryFn } = viewCountQueryOptions('doc1', async () => {
      throw new TypeError('fetch failed');
    });
    await expect((queryFn as () => Promise<unknown>)()).resolves.toMatchObject({ data: null });
  });
});
