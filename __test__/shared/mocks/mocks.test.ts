import { describe, expect, it } from 'vitest';

describe('Mock API Handlers 테스트', () => {
  it('GET /api/msw 테스트', async () => {
    const response = await fetch('/api/msw');
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      message: 'msw 연결',
    });
  });
});
