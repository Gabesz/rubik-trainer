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

if ('serviceWorker' in navigator) {
  registerSW({ immediate: true });
}

