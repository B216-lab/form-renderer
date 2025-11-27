import ru from '@vueform/vueform/locales/ru';
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
  locales: { ru },
  locale: 'ru',
  showRequired: ['floating'],
});
