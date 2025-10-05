import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { server } from '@/src/__mock__/node';

const originalConsoleError = console.error;

beforeAll(() => {
  server.listen({
    onUnhandledRequest: 'error',
  });

  vi.spyOn(console, 'error').mockImplementation((...args) => {
    const message = args.join(' ');
    if (message.includes('fetchPriority')) {
      return;
    }

    if (message.includes('A component is changing an uncontrolled input to be controlled.')) {
      return;
    }

    originalConsoleError(...args);
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
