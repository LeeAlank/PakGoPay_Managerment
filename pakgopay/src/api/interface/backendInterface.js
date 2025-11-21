import service from '../axios.js'

export async function LoginBack(loginFormData) {
    console.info('请求组装的token',localStorage.getItem('token'));
    console.info(loginFormData)
    return service({
        url: '/api/pakGoPay/server/Login/login',
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${encodeURIComponent(localStorage.getItem('token'))}`,
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

/**
 * 加载菜单
 * @returns {Promise<void>}
 */
export async function menu() {
    return service({
        url: '/api/pakGoPay/server/menu',
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    })
}