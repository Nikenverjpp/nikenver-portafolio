import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const fromSrc = (path: string) => fileURLToPath(new URL(`./src/app/${path}`, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@core': fromSrc('core'),
      '@shared': fromSrc('shared'),
      '@components': fromSrc('shared/components'),
      '@features': fromSrc('features'),
    },
  },
  test: {
    include: ['src/**/*.spec.ts', 'scripts/**/*.spec.mjs'],
  },
});
