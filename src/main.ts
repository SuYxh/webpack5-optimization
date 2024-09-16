import { createApp, h } from 'vue'
// import ElementPlus from 'element-plus'
import elementInstall from "./plugins/install"
import 'element-plus/dist/index.css'
import App from "./App.vue"
import './style.css'
import router from './router/index'

createApp(App).use(elementInstall).use(router).mount("#app")

