import { URL, fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => (id.includes('node_modules') ? 'vendor' : undefined),
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  assetsInclude: ['/api/**'],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5059',
        changeOrigin: true,
      },
    },
  },
});
