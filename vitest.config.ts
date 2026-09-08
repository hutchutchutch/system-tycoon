import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['worker/test/**/*.test.ts', 'src/**/*.test.ts', 'scripts/**/*.test.ts'],
    environment: 'node',
    testTimeout: 20_000,
  },
});
