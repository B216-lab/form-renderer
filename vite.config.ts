import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import path from 'node:path';
import ui from '@nuxt/ui/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    ui({
      ui: {
        colors: {
          primary: 'green',
          neutral: 'zinc',
        },
        icons: {
          light: 'i-ph-sun',
          dark: 'i-ph-moon',
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  preview: {
    allowedHosts: true // TODO figure out why it's not working with precise host
  },
  server: {
    allowedHosts: true,
    host: true,
    port: 5173,
  },
});
