import axios from 'axios'
import { ElNotification } from 'element-plus'
import { CloseBold } from '@element-plus/icons-vue'
import router from "@/router/index.js";
const service = axios.create({
    //baseURL: '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'text/plain'
    }
});

service.interceptors.request.use(config => {
    return config;
}, error => {
    console.info("some error happened when request interceptors", error)
    return Promise.reject(error);
})

service.interceptors.response.use(response => {
    let currentPath = localStorage.getItem('currentPath')
    localStorage.setItem('unauthorizedShown', "false");
    return response;
}, error => {
    if (error.response && error.response.status === 401) {

        if (localStorage.getItem('unauthorizedShown')!=='true') {
            localStorage.setItem('unauthorizedShown', "true");
            if (localStorage.getItem('currentPath') && !localStorage.getItem('unauthorizedShown').includes('/web/login')) {
                ElNotification({
                    title: 'warn',
                    message: 'this page is timed out. will refresh this page',
                    closeIcon: CloseBold,
                    type: 'error',
                    position: 'bottom-right',
                    offset: 500
                })
                router.replace(localStorage.getItem('currentPath')).then((result) => {
                    if (result) {
                        this.$notify({
                            title: 'success',
                            message: 'refresh page successfully',
                            type: 'success',
                            position: 'bottom-right',
                            duration: 1000
                        })
                    }
                })
            }

        }
        return Promise.reject(error);
    }
})

export default service;