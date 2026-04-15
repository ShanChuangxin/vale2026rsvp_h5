import './assets/main.css'
import 'vant/lib/index.css';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Vant from 'vant'
// import VConsole from 'vconsole';

import App from './App.vue'
import router from './router'




const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(Vant)
// const vConsole = new VConsole()
// app.use(vConsole as any)

app.mount('#app')
