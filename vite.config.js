import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => ({
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
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['oll/svg/Oll-1.svg'],
      manifest: {
        name: 'Rubik Trainer',
        short_name: 'Rubik Trainer',
        description: "Practice and track Rubik's Cube OLL, PLL, and F2L algorithms.",
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
      ...(mode === 'production' && {
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest,json}'],
          globIgnores: ['**/node_modules/**/*', 'sw.js', 'workbox-*.js'],
          runtimeCaching: [
            {
              urlPattern: /\/.*\/algorithms\.json$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'algorithms-cache',
                expiration: {
                  maxEntries: 3,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                networkTimeoutSeconds: 3,
              },
            },
            {
              urlPattern: /\/.*\/svg\/.*\.svg$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'svg-cache',
                expiration: {
                  maxEntries: 200,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
              },
            },
          ],
        },
      }),
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
}));

