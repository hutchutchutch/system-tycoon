import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Configure Rolldown's Oxc minifier directly so production diagnostics do
    // not leak, without pulling in a second JavaScript minifier.
    minify: false,
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
