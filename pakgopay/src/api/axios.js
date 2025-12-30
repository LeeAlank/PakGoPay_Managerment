import axios from 'axios'
import { ElNotification } from 'element-plus'
import { CloseBold } from '@element-plus/icons-vue'
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
    localStorage.setItem('unauthorizedShown', "false");
    return response;
}, error => {
    if (error.response && error.response.status === 401) {

        if (localStorage.getItem('unauthorizedShown')!=='true') {
            localStorage.setItem('unauthorizedShown', "true");
            ElNotification({
                title: 'warn',
                message: 'this page is timed out. Please fresh page and try again',
                closeIcon: CloseBold,
                type: 'error',
                position: 'bottom-right',
                offset: 500
            })
        }
        return Promise.reject(error);
    }
})

export default service;