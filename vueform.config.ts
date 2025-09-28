import ru from '@vueform/vueform/locales/ru'
import theme from '@vueform/vueform/dist/vueform'
import { defineConfig } from '@vueform/vueform'

import '@vueform/vueform/dist/vueform.css';

export default defineConfig({
  theme,
  locales: { ru },
  locale: 'ru',
})
