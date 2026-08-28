import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const mapChunks = (id: string) => {
  if (id.includes('node_modules')) {
    if (id.includes('node_modules/chart.js')) {
      return 'chartjs';
    }

    return 'vendor';
  }

  return undefined;
};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: mapChunks,
      },
    },
  },
  plugins: [react(), svgr()],
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
