import axios from 'axios'
import { ElNotification } from 'element-plus'
import { CloseBold } from '@element-plus/icons-vue'
import router from "@/router/index.js";
import { i18n } from '@/main.js';
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
let lastRateLimitNotifyAt = 0;
const RATE_LIMIT_NOTIFY_COOLDOWN_MS = 3000;
let lastAuthExpiredNotifyAt = 0;
const AUTH_EXPIRED_NOTIFY_COOLDOWN_MS = 3000;
const pendingSubmitRequestMap = new Map();
const MUTATION_GET_URL_PATTERNS = [
    "/SystemConfig/manageLoginUserStatus",
    "/SystemConfig/deleteLoginUser",
    "/SystemConfig/resetGoogleKey",
    "/SystemConfig/bindGoogleKey",
    "/notation/markNotation"
];
const MUTATION_POST_URL_KEYWORDS = [
    "/add",
    "/edit",
    "/create",
    "/update",
    "/delete",
    "/modify",
    "/manual",
    "/reset",
    "/bind",
    "/manage",
    "/config"
];

function translate(key) {
    return i18n?.global?.t ? i18n.global.t(key) : key;
}

function shouldMaskBackendMessage(code, message) {
    const normalizedMessage = String(message || "").trim().toLowerCase();
    if (!normalizedMessage) return false;
    if (code === 1) return true;
    return normalizedMessage === "server internal error";
}

function normalizeBusinessResponseMessage(data) {
    if (!data || typeof data !== "object") {
        return data;
    }
    if (shouldMaskBackendMessage(data.code, data.message)) {
        data.message = translate('common.serverInternalError');
    }
    return data;
}

function isSubmitMethod(method) {
    const m = String(method || "").toLowerCase();
    return m === "post" || m === "put" || m === "patch" || m === "delete";
}

function safeStringify(data) {
    if (data === undefined || data === null) return "";
    if (typeof data === "string") return data;
    try {
        return JSON.stringify(data);
    } catch (e) {
        return String(data);
    }
}

function buildSubmitRequestKey(config) {
    const method = String(config?.method || "").toLowerCase();
    const url = String(config?.url || "");
    const params = safeStringify(config?.params);
    const data = safeStringify(config?.data);
    return `${method}|${url}|${params}|${data}`;
}

function shouldPreventDuplicateSubmit(config) {
    if (!config) return false;
    if (config.allowRepeatSubmit === true) return false;
    const method = String(config.method || "").toLowerCase();
    const url = String(config.url || "");
    if (method === "get") {
        return MUTATION_GET_URL_PATTERNS.some((pattern) => url.includes(pattern));
    }
    if (method === "put" || method === "patch" || method === "delete") {
        return true;
    }
    if (method === "post") {
        return MUTATION_POST_URL_KEYWORDS.some((keyword) => url.includes(keyword));
    }
    return false;
}

function clearPendingSubmitByConfig(config) {
    const key = config?.__submitRequestKey;
    if (key && pendingSubmitRequestMap.has(key)) {
        pendingSubmitRequestMap.delete(key);
    }
}

function buildRateLimitedData(url) {
    if (!url) return JSON.stringify({});
    if (url.includes('/CurrencyTypeManagement/currencyTypeInfo')) {
        return JSON.stringify({ currencyTypeDTOList: [] });
    }
    return JSON.stringify({});
}

function notifyRateLimitedOnce(message) {
    const content = message || translate('common.rateLimitMessage');
    const now = Date.now();
    if (now - lastRateLimitNotifyAt < RATE_LIMIT_NOTIFY_COOLDOWN_MS) {
        return;
    }
    lastRateLimitNotifyAt = now;
    ElNotification({
        title: 'warn',
        message: content,
        closeIcon: CloseBold,
        type: 'warning',
        position: 'bottom-right',
        offset: 20
    });
}

function notifyAuthExpiredOnce() {
    const now = Date.now();
    if (now - lastAuthExpiredNotifyAt < AUTH_EXPIRED_NOTIFY_COOLDOWN_MS) {
        return;
    }
    lastAuthExpiredNotifyAt = now;
    ElNotification({
        title: 'warn',
        message: 'login expired, please login again',
        closeIcon: CloseBold,
        type: 'error',
        position: 'bottom-right',
        offset: 500
    })
}

function processRefreshQueue(error, token) {
    refreshQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    refreshQueue = [];
}

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

function buildUnauthorizedError(config, source) {
    const err = new Error('unauthorized');
    err.config = config;
    if (source?.response) {
        err.response = source.response;
    }
    return err;
}

function handleUnauthorizedByConfig(config, source) {
    const rejectErr = buildUnauthorizedError(config, source);
    if (!config) {
        return Promise.reject(rejectErr);
    }
    if (config.skip401Handler) {
        return Promise.reject(rejectErr);
    }
    if (isLoginRoute()) {
        return Promise.reject(rejectErr);
    }
    if (config._retry) {
        return Promise.reject(rejectErr);
    }

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        notifyAuthExpiredOnce();
        clearAuthAndRedirect();
        return Promise.reject(rejectErr);
    }

    if (isRefreshing) {
        return new Promise((resolve, reject) => {
            refreshQueue.push({ resolve, reject });
        }).then((token) => {
            const retryConfig = { ...config };
            retryConfig.headers = retryConfig.headers || {};
            retryConfig.headers.Authorization = `Bearer ${token}`;
            return service(retryConfig);
        });
    }

    isRefreshing = true;
    config._retry = true;
    return refreshClient.get('/api/pakGoPay/server/Login/refreshToken', {
        params: { freshToken: refreshToken }
    }).then((res) => {
        if (res?.data === 'refresh' || res?.data?.code !== 0) {
            notifyAuthExpiredOnce();
            clearAuthAndRedirect();
            processRefreshQueue(rejectErr, null);
            return Promise.reject(rejectErr);
        }

        const token = res?.data?.token || res?.data?.data?.token;
        const newRefreshToken = res?.data?.refreshToken || res?.data?.data?.refreshToken;
        if (token) {
            localStorage.setItem("token", token);
        }
        if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
        }
        processRefreshQueue(null, token);
        const retryConfig = { ...config };
        retryConfig.headers = retryConfig.headers || {};
        retryConfig.headers.Authorization = `Bearer ${token}`;
        return service(retryConfig);
    }).catch((err) => {
        notifyAuthExpiredOnce();
        clearAuthAndRedirect();
        processRefreshQueue(err, null);
        return Promise.reject(err);
    }).finally(() => {
        isRefreshing = false;
    });
}

service.interceptors.request.use(config => {
    if (shouldPreventDuplicateSubmit(config)) {
        const requestKey = buildSubmitRequestKey(config);
        if (pendingSubmitRequestMap.has(requestKey)) {
            const err = new Error("duplicate submit");
            err.isDuplicateSubmit = true;
            err.config = config;
            return Promise.reject(err);
        }
        config.__submitRequestKey = requestKey;
        pendingSubmitRequestMap.set(requestKey, Date.now());
    }
    return config;
}, error => {
    console.info("some error happened when request interceptors", error)
    return Promise.reject(error);
})

service.interceptors.response.use(response => {
    clearPendingSubmitByConfig(response?.config);
    normalizeBusinessResponseMessage(response?.data);
    if (response?.status === 200 && (response?.data?.rateLimited === true || response?.data?.code === 429) && !response?.data?.rateLimitedNotified) {
        notifyRateLimitedOnce();
    }
    if (response?.status === 200 && response?.data?.code === 401) {
        return handleUnauthorizedByConfig(response.config, { response });
    }
    return response;
}, error => {
    clearPendingSubmitByConfig(error?.config);
    normalizeBusinessResponseMessage(error?.response?.data);
    if (error?.isDuplicateSubmit === true) {
        return Promise.reject(error);
    }
    if (error.response && error.response.status === 429) {
        notifyRateLimitedOnce();
        const fallbackData = buildRateLimitedData(error.config?.url);
        return Promise.resolve({
            status: 200,
            data: {
                code: 0,
                rateLimited: true,
                rateLimitedNotified: true,
                message: i18n?.global?.t ? i18n.global.t('common.rateLimitMessage') : '请求过于频繁，请稍后重试',
                data: fallbackData
            }
        });
    }
    if (error.response && error.response.status === 401) {
        return handleUnauthorizedByConfig(error.config, error);
    }
    return Promise.reject(error);
})

export default service;
