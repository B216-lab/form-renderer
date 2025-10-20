import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Vueform from '@vueform/vueform'
import vueformConfig from './../vueform.config'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(Vueform, vueformConfig)
app.mount('#app')