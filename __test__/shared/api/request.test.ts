import { describe, expect, it } from 'vitest';

import { HttpError, jsonOrThrow } from '@/src/shared/api/request';

describe('jsonOrThrow', () => {
  it('2xx면 body를 반환한다', async () => {
    await expect(jsonOrThrow(Response.json({ ok: 1 }))).resolves.toEqual({ ok: 1 });
  });

  it('에러 status면 body.message와 status를 담은 HttpError를 던진다', async () => {
    const error = await jsonOrThrow(Response.json({ message: '없음' }, { status: 404 })).catch(e => e);
    expect(error).toBeInstanceOf(HttpError);
    expect(error).toMatchObject({ message: '없음', status: 404 });
  });

  it('JSON이 아닌 에러 응답(nginx 502 HTML)도 status를 잃지 않는다', async () => {
    const error = await jsonOrThrow(new Response('<html>Bad Gateway</html>', { status: 502 })).catch(e => e);
    expect(error).toBeInstanceOf(HttpError);
    expect(error).toMatchObject({ message: 'API 요청 실패', status: 502 });
  });

  it('okStatuses에 포함된 status는 body를 그대로 반환한다', async () => {
    await expect(jsonOrThrow(Response.json({ code: 'NEEDS_PASSWORD' }, { status: 403 }), [403])).resolves.toEqual({
      code: 'NEEDS_PASSWORD',
    });
  });
});
