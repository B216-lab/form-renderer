import ru from '@vueform/vueform/locales/ru';
import en from '@vueform/vueform/locales/en';
import theme from '@vueform/vueform/dist/vueform';
import { defineConfig } from '@vueform/vueform';
import '@vueform/vueform/dist/vueform.css';

import axios from 'axios';

axios.defaults.headers.post = {
  'Content-Type': 'application/json',
};

export default defineConfig({
  theme,
  axios,
  locales: { ru, en },
  locale: 'ru',
  env: import.meta.env.MODE,
  showRequired: ['floating'],
});
