import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Keep Vite's minification mode aligned with the Rolldown options below.
    // `false` plus output.minify left imports of removed CSS-only JS chunks in
    // Vite 8.2.2. scripts/check-build.mjs checks the actual emitted imports.
    minify: 'oxc',
    cssMinify: 'lightningcss',
    rolldownOptions: {
      output: {
        minify: {
          compress: {
            dropConsole: true,
            dropDebugger: true,
          },
          mangle: true,
        },
      },
    },
  },
  server: {
    proxy: {
      // Proxy API requests to the Cloudflare Worker dev server
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
});
