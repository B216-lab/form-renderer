import { createApp } from 'vue'
import './style.css'
import './style.scss'
import App from './App.vue'
import Vueform from '@vueform/vueform'
import vueformConfig from './../vueform.config'
import { createPinia } from 'pinia'
import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/vue3-openlayers.css";

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(Vueform, vueformConfig)
app.use(OpenLayersMap);
app.mount('#app')