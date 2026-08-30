import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['**/node_modules/**', '**/.git/**', 'goldhand/**'],
  },
  resolve: {
    alias: {
      '@/src': path.resolve(__dirname, './src'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@': path.resolve(__dirname, '.'),
    },
  },
});
