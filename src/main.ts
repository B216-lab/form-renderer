import { createApp, nextTick } from 'vue';
import './style.css';
import App from './App.vue';
import Vueform from '@vueform/vueform';
import vueformConfig from './../vueform.config';
import { createPinia } from 'pinia';
import router from './router';
import { useAuthStore } from './stores/authStore';
import { handleApiError } from './utils/errorHandler';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(Vueform, vueformConfig);
app.use(router);

// Предварительная проверка сессии, затем запуск приложения и роутера
const authStore = useAuthStore();

authStore
  .checkAuth()
  .catch(() => undefined)
  .finally(async () => {
    app.mount('#app');

    // Показываем ошибку сети после монтирования приложения,
    // когда message API уже инициализирован
    if (authStore.lastNetworkError) {
      // Ждём следующего тика, чтобы убедиться, что все компоненты смонтированы
      await nextTick();
      // Дополнительная небольшая задержка для инициализации message API
      setTimeout(() => {
        if (authStore.lastNetworkError) {
          handleApiError(authStore.lastNetworkError);
          authStore.lastNetworkError = null;
        }
      }, 50);
    }
  });
