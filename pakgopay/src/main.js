
import router from "./router";
import { createApp } from 'vue'
import App from './App.vue'
//import App from "@/components/PakGoPay.vue"
import 'virtual:svg-icons-register'
import svgIcon from '@/components/SvgIcon/index.vue'
import service from "@/api/axios.js";

const app = createApp(App)
app.component('SvgIcon', svgIcon)
app.config.globalProperties.$http = service
app.use(router)
app.mount('#app')
