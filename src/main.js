import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Home from './views/Home.vue';
import Trainer from './views/Trainer.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './assets/main.css';
import { registerSW } from 'virtual:pwa-register';

const router = createRouter({
  history: createWebHistory('/rubik-trainer/'),
  routes: [
    { path: '/', component: Home },
    { path: '/oll', component: Trainer, props: { mode: 'oll' } },
    { path: '/pll', component: Trainer, props: { mode: 'pll' } },
    { path: '/f2l', component: Trainer, props: { mode: 'f2l' } },
  ],
});

const app = createApp(App);
app.use(router);
app.mount('#app');

if ('serviceWorker' in navigator) {
  registerSW({ immediate: true });
}

