import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  root: '.', 
  publicDir: 'public', 
  
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'Scripts/lib/draco_decoder.wasm', dest: 'draco' },
        { src: 'Scripts/lib/draco_wasm_wrapper.js', dest: 'draco' },
        { src: 'models', dest: '.'}
      ]
    })
  ],

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  // Важно для работы WASM в режиме разработки
  optimizeDeps: {
    exclude: ['draco_decoder']
  }
});