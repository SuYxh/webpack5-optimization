import { createApp, h } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from "./App.vue"
import './style.css'
import router from './router/index'

createApp(App).use(ElementPlus).use(router).mount("#app")

