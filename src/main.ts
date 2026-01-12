import './style.css';

import { createApp, watch } from 'vue';
import App from './App.vue';
import Vueform from '@vueform/vueform';
import vueformConfig from './../vueform.config';
import { createPinia } from 'pinia';
import router from './router';
import { useAuthStore } from './stores/authStore';
import ui from '@nuxt/ui/vue-plugin';
import * as UnheadVue from '@unhead/vue';
import { z } from 'zod';
import { en as zodEn, ru as zodRu } from 'zod/locales';
import { createI18nInstance, type AppLocale } from './i18n';

const app = createApp(App);
const pinia = createPinia();
const i18n = createI18nInstance();
// Unhead Vue has slightly mismatched typings in this version; safely access factory functions.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const unheadAny = UnheadVue as any;
const head =
  // Prefer `createHead` if available (documented API)
  unheadAny.createHead?.() ??
  // Fallback for typings suggesting `createUnhead`
  unheadAny.createUnhead?.();

app.use(pinia);
app.use(router);
app.use(ui);
app.use(i18n);
if (head) {
  app.use(head);
}

app.use(Vueform, {
  ...vueformConfig,
  locale: i18n.global.locale.value as AppLocale,
});

const configureZodLocale = (locale: AppLocale) => {
  if (locale === 'ru') {
    z.config(zodRu());
  } else {
    z.config(zodEn());
  }
};

// Initial Zod locale based on i18n
configureZodLocale(i18n.global.locale.value as AppLocale);

// Keep Zod locale in sync with vue-i18n locale
watch(
  i18n.global.locale,
  (newLocale) => {
    configureZodLocale(newLocale as AppLocale);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('locale', newLocale);
    }
  },
  { immediate: false }
);

const authStore = useAuthStore();

authStore
  .checkAuth()
  .catch(() => undefined)
  .finally(async () => {
    app.mount('#app');

    if (authStore.lastNetworkError) {
      // Очищаем сохранённую сетевую ошибку без логирования в консоль,
      // чтобы не засорять логи скрытыми от пользователя ошибками
      authStore.lastNetworkError = null;
    }
  });
