import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import Vueform from '@vueform/vueform';
import vueformConfig from './../vueform.config';
import { createPinia } from 'pinia';
import router from './router';
import { useAuthStore } from './stores/authStore';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(Vueform, vueformConfig);
app.use(router);

const authStore = useAuthStore();

if (import.meta.env.DEV) {
  app.mount('#app');
} else {
  authStore
    .checkAuth()
    .catch(() => undefined)
    .finally(() => {
      app.mount('#app');
    });
}
