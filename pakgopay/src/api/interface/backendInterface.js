import service from '../axios.js'
import router from "@/router/index.js";

export async function LoginBack(loginFormData) {
    return service({
        url: '/api/pakGoPay/server/Login/login',
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            /*'Authorization': `Bearer ${encodeURIComponent(localStorage.getItem('token'))}`,*/
        },
        data: loginFormData,
        responseType: 'json',
    })
}

/**
 *  向后端发送心跳校验token
 *  */
export async function heart() {
    return service({
        url: '/api/pakGoPay/server/heart',
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
}

export async function menu() {
    return service({
        url: '/api/pakGoPay/server/menu',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
}

export function logOut() {
    alert("logot")
    localStorage.removeItem("token");
    localStorage.removeItem("menu")
    localStorage.removeItem("userName")
    localStorage.removeItem("userId")
    localStorage.removeItem("currentPath")
    /*localStorage.removeItem("refreshToken")*/
    router.push("/web/login").then()
}

export async function getQrCode(username, password) {
    return service({
        url: '/api/pakGoPay/server/Login/getCode',
        method: 'GET',
        params: {
            userId: username,
            password: password
        }
    })
}

export async function refreshAccessToken(refreshToken) {
    return service({
        url: '/api/pakGoPay/server/Login/refreshToken',
        method: 'GET',
        params: {
            freshToken: refreshToken
        }
    })
}

export async function filterSearchMerchantStatement(form) {
    console.log(JSON.stringify(form))
    return service({
        url: '/api/pakGoPay/server/merchant/merchantStatement',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: form,
        responseType: 'json',
    })
}