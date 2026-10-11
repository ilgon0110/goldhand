import { logBusinessEvent, logServerError } from '@/src/shared/lib/server/structuredLogger';

describe('structuredLogger', () => {
  function captureLog(message: string, error: unknown) {
    const write = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);

    logServerError(message, error);

    const output = String(write.mock.calls[0][0]);
    write.mockRestore();

    return { output, parsed: JSON.parse(output) };
  }

  it('writes standard error fields as one physical JSON line', () => {
    const error = new Error('database failed');
    Object.assign(error, { code: 'firestore/unavailable', digest: 'abc123' });

    const { output, parsed } = captureLog('Failed to fetch event', error);

    expect(output.endsWith('\n')).toBe(true);
    expect(output.slice(0, -1)).not.toContain('\n');
    expect(parsed).toMatchObject({
      level: 'error',
      service: 'nextjs',
      event: 'application.error',
      message: 'Failed to fetch event',
      error: {
        type: 'Error',
        message: 'database failed',
        code: 'firestore/unavailable',
        digest: 'abc123',
      },
    });
  });

  it('does not serialize arbitrary error object properties', () => {
    const { output, parsed } = captureLog('Request failed', {
      name: 'FirebaseError',
      message: 'request failed',
      token: 'must-not-be-logged',
      requestBody: { phone: '010-0000-0000' },
    });

    expect(parsed.error).toEqual({
      type: 'FirebaseError',
      message: 'request failed',
    });
    expect(output).not.toContain('must-not-be-logged');
    expect(output).not.toContain('010-0000-0000');
  });

  it('normalizes primitive thrown values', () => {
    const { parsed } = captureLog('Unexpected failure', 'string failure');

    expect(parsed.error).toEqual({
      type: 'Error',
      message: 'string failure',
    });
  });

  it('writes privacy-safe business events as one physical JSON line', () => {
    const write = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    logBusinessEvent('notification.read', {
      actorType: 'member',
      scope: 'single',
    });

    const output = String(write.mock.calls[0][0]);
    write.mockRestore();

    expect(output.endsWith('\n')).toBe(true);
    expect(output.slice(0, -1)).not.toContain('\n');
    expect(JSON.parse(output)).toEqual({
      timestamp: expect.any(String),
      level: 'info',
      service: 'nextjs',
      environment: expect.any(String),
      event: 'notification.read',
      actor_type: 'member',
      resource_type: 'notification',
      scope: 'single',
    });
  });
});
