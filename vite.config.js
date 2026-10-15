// vite.config.js
import { defineConfig } from 'vite';

function resolveBase() {
  if (process.env.YANDEX === '1') return './';
  if (process.env.VERCEL === '1') return '/';
  return '/Cubik_rubika/';
}

export default defineConfig({
  base: resolveBase(),
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  server: { port: 3000, open: true }
});