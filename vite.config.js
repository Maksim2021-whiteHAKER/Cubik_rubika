import { defineConfig } from 'vite';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: '.', // Указываем, что исходники в корне
  publicDir: 'assets', // Если у вас есть папка assets со статикой, иначе можно убрать
  base: './', // Важно для открытия index.html напрямую без сервера (file:// или GitHub Pages)
  
  build: {
    outDir: 'dist', // Папка для собранного проекта
    assetsDir: 'assets',
    minify: 'terser', // Максимальное сжатие JS
    sourcemap: false, // Отключить карты кода для релиза (уменьшает размер)
    chunkSizeWarningLimit: 1000, // Увеличим лимит до 1000 kB (ваш main.js большой из-за Three.js)
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // Оптимизация имен файлов
        entryFileNames: `js/[name].[hash].js`,
        chunkFileNames: `js/[name].[hash].js`,
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images';
          }
          if (/glb|gltf/i.test(extType)) {
            extType = 'models';
          }
          if (/mp3|wav|ogg/i.test(extType)) {
            extType = 'audio';
          }
          if (/webp/i.test(extType)) {
            extType = 'webp';
          }
          if (/css/i.test(extType)) {
            extType = 'css';
          }
          return `${extType}/[name]-[hash][extname]`;
        },
      },
    },
  },

  server: {
    open: true, // Автоматически открывать браузер при запуске dev-сервера
    port: 3000,
  },
});
