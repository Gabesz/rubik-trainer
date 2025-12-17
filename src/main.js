import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Home from './views/Home.vue';
import Trainer from './views/Trainer.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/main.css';
import { registerSW } from 'virtual:pwa-register';

// Detect if running in iframe or Tizen OS app (for Service Worker registration)
const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
const isTizenOS = typeof navigator !== 'undefined' && /Tizen/i.test(navigator.userAgent);
const shouldSkipServiceWorker = isInIframe || isTizenOS;

// Router base path is always /rubik-trainer/ since that's where the app is hosted
const router = createRouter({
  history: createWebHistory('/rubik-trainer/'),
  routes: [
    { path: '/', component: Home },
    { 
      path: '/oll/:algorithmId?', 
      component: Trainer, 
      props: (route) => ({ mode: 'oll', algorithmId: route.params.algorithmId }) 
    },
    { 
      path: '/pll/:algorithmId?', 
      component: Trainer, 
      props: (route) => ({ mode: 'pll', algorithmId: route.params.algorithmId }) 
    },
    { 
      path: '/f2l/:algorithmId?', 
      component: Trainer, 
      props: (route) => ({ mode: 'f2l', algorithmId: route.params.algorithmId }) 
    },
  ],
});

const app = createApp(App);
app.use(router);
app.mount('#app');

// Clean up Service Worker on Tizen OS (unregister existing and clear caches)
// This prevents fetch errors when returning to the app after closing it
if (isTizenOS && 'serviceWorker' in navigator) {
  // Unregister all Service Workers
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister().catch((err) => {
        console.warn('Failed to unregister Service Worker:', err);
      });
    });
  });
  
  // Clear all caches to prevent stale cached assets
  if ('caches' in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName).catch((err) => {
          console.warn(`Failed to delete cache ${cacheName}:`, err);
        });
      });
    });
  }
}

// Don't register Service Worker if running in iframe or Tizen OS app
if ('serviceWorker' in navigator && !shouldSkipServiceWorker) {
  registerSW({ immediate: true });
}

