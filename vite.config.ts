import { resolve } from 'path';
import { defineConfig } from 'vite';
import gzip from 'vite-plugin-compression';
import cesium from 'vite-plugin-cesium';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), cesium(), gzip()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '#': resolve(__dirname, 'types'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: "@import 'src/styles/index.scss';",
      },
    },
  },
});
