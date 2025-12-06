import { createApp, nextTick } from 'vue';
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

authStore
  .checkAuth()
  .catch(() => undefined)
  .finally(async () => {
    app.mount('#app');

    if (authStore.lastNetworkError) {
      // Ждём следующего тика, чтобы убедиться, что все компоненты смонтированы
      await nextTick();
      // Дополнительная небольшая задержка для инициализации message API
      setTimeout(() => {
        if (authStore.lastNetworkError) {
          console.warn(
            '[Auth] Initial auth check failed:',
            authStore.lastNetworkError
          );
          authStore.lastNetworkError = null;
        }
      }, 50);
    }
  });
