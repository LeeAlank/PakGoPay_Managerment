
import router from "./router";
import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:svg-icons-register'
import svgIcon from '@/components/SvgIcon/index.vue'
import service from "@/api/axios.js";
import GoogleLogin from 'vue3-google-login'
import ElementPlus from 'element-plus'
import {ElDialog} from "element-plus";
import 'element-plus/dist/index.css'

let clientId = '554967085940-o3uql5embk68sm0ihlh466ho3qkqsv26.apps.googleusercontent.com'

const app = createApp(App)
app.component('SvgIcon', svgIcon)
app.config.globalProperties.$http = service
app.use(ElementPlus)
app.use(ElDialog)
app.use(GoogleLogin, {
    clientId: clientId,
})
app.use(router)
app.mount('#app')
