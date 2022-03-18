import { resolve } from 'path';
import { defineConfig } from 'vite';
import gzip from 'vite-plugin-compression';
import cesium from 'vite-plugin-cesium';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    cesium(),
    gzip(),
    viteStaticCopy({
      targets: [
        {
          src: './node_modules/gdal3.js/dist/package/gdal3WebAssembly.wasm',
          dest: 'gdal',
        },
        {
          src: './node_modules/gdal3.js/dist/package/gdal3WebAssembly.data',
          dest: 'gdal',
        },
      ],
    }),
  ],
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
  server: {
    proxy: {
      '^/json/.*': 'http://121.199.160.202/',
    },
  },
});
