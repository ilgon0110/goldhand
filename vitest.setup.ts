import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { server } from '@/src/__mock__/node';

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error',
  });
});
afterAll(() => {
  server.close();
  cleanup();
  vi.clearAllMocks();
});
afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});
