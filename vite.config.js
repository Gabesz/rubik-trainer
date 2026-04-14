import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(() => ({
  base: '/rubik-trainer/',
  root: __dirname,
  build: {
    outDir: resolve(__dirname, 'dist'),
  },
  preview: {
    port: 4173,
    strictPort: true,
    host: true,
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === 'twisty-player',
        },
      },
    }),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,json}'],
        globIgnores: ['**/node_modules/**/*', 'sw.js', 'workbox-*.js'],
      },
      includeAssets: ['oll/svg/Oll-1.svg'],
      manifest: {
        name: 'RUBIK TRAINER',
        short_name: 'RUBIK TRAINER',
        description: "Practice and track Rubik's Cube OLL, PLL, F2L, and Advanced F2L algorithms.",
        start_url: '/rubik-trainer/',
        scope: '/rubik-trainer/',
        theme_color: '#0d6efd',
        background_color: '#f8f9fa',
        icons: [
          {
            src: 'oll/svg/Oll-1.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
          },
          {
            src: 'oll/svg/Oll-1.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
}));
