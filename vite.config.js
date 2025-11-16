import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/rubik-trainer/',
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
      devOptions: {
        enabled: true,
      },
    }),
  ],
});

