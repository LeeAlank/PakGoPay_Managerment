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

const refreshClient = axios.create({
    timeout: 30000,
    headers: {
        'Content-Type': 'text/plain'
    }
});

let isRefreshing = false;
let refreshQueue = [];

function isLoginRoute() {
    const currentPath = router.currentRoute?.value?.path;
    const currentMeta = router.currentRoute?.value?.meta;
    if (currentPath === "/web/login" || currentMeta?.showBar) {
        return true;
    }
    return window.location?.pathname === "/web/login";
}

function clearAuthAndRedirect() {
    localStorage.removeItem("token");
    localStorage.removeItem("menu")
    localStorage.removeItem("userName")
    localStorage.removeItem("userId")
    localStorage.removeItem("currentPath")
    localStorage.removeItem("roleName")
    router.push("/web/login");
}

service.interceptors.request.use(config => {
    return config;
}, error => {
    console.info("some error happened when request interceptors", error)
    return Promise.reject(error);
})

service.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        if (error.config && error.config.skip401Handler) {
            return Promise.reject(error);
        }
        if (isLoginRoute()) {
            return Promise.reject(error);
        }
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            ElNotification({
                title: 'warn',
                message: 'login expired, please login again',
                closeIcon: CloseBold,
                type: 'error',
                position: 'bottom-right',
                offset: 500
            })
            clearAuthAndRedirect();
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                refreshQueue.push({ resolve, reject });
            });
        }

        isRefreshing = true;
        return refreshClient.get('/api/pakGoPay/server/Login/refreshToken', {
            params: { freshToken: refreshToken }
        }).then((res) => {
            if (res?.data === 'refresh' || res?.data?.code !== 0) {
                ElNotification({
                    title: 'warn',
                    message: 'login expired, please login again',
                    closeIcon: CloseBold,
                    type: 'error',
                    position: 'bottom-right',
                    offset: 500
                })
                clearAuthAndRedirect();
                refreshQueue.forEach(({ reject }) => reject(error));
                refreshQueue = [];
                return Promise.reject(error);
            }

            if (res?.data?.code === 0) {
                const token = res?.data?.token || res?.data?.data?.token;
                const newRefreshToken = res?.data?.refreshToken || res?.data?.data?.refreshToken;
                if (token) {
                    localStorage.setItem("token", token);
                }
                if (newRefreshToken) {
                    localStorage.setItem("refreshToken", newRefreshToken);
                }
                refreshQueue.forEach(({ resolve }) => resolve());
                refreshQueue = [];
                location.reload();
                return Promise.reject(error);
            }

            return Promise.reject(error);
        }).catch((err) => {
            refreshQueue.forEach(({ reject }) => reject(err));
            refreshQueue = [];
            return Promise.reject(err);
        }).finally(() => {
            isRefreshing = false;
        });
    }
    return Promise.reject(error);
})

export default service;
