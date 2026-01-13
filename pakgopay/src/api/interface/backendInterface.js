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

    service({
        url: '/api/pakGoPay/server/Login/logout',
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(res => {
        if (res.status === 200) {
            if (res.data.code === 0) {
                localStorage.removeItem("token");
                localStorage.removeItem("menu")
                localStorage.removeItem("userName")
                localStorage.removeItem("userId")
                localStorage.removeItem("currentPath")
                /*localStorage.removeItem("refreshToken")*/
                router.push("/web/login").then()
            } else {
                this.$notify({
                    title:'错误',
                    message: 'logout failed',
                    type: 'error',
                    position: 'top-right',
                })
            }
        }
    })
}

export async function getQrCode(username, password) {
    return service({
        url: '/api/pakGoPay/server/Login/getCode',
        method: 'GET',
        params: {
            userName: username,
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

export async function roleList(roleName) {
    return service({
        url: '/api/pakGoPay/server/SystemConfig/roleList',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: {
            roleName: roleName
        }
    })
}

export async function loginUserList() {
    return service({
        url: '/api/pakGoPay/server/SystemConfig/loginUserList',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
}

export async function loginUserByLoginName(loginName) {
    return service({
        url: '/api/pakGoPay/server/SystemConfig/loginUserByLoginName',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: {
            loginName: loginName
        }
    })
}

export async function addNewLoginUser(form) {
    return service({
        url: '/api/pakGoPay/server/SystemConfig/createUser',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: form,
        responseType: 'json',
    })
}

export function manageLoginUserStatus(user_id, status, googleCode) {
    return service({
        url: '/api/pakGoPay/server/SystemConfig/manageLoginUserStatus',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: {
            userId: user_id,
            status: status,
            googleCode: googleCode,
            operatorId: `${localStorage.getItem('userId')}`
        }
    })
}

export function deleteLoginUser(user_id, googleCode) {
    return service({
        url: '/api/pakGoPay/server/SystemConfig/deleteLoginUser',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: {
            userId: user_id,
            googleCode: googleCode,
            operatorId: `${localStorage.getItem('userId')}`
        }
    })
}

export function addRole(roleInfo) {
    return service({
        url: '/api/pakGoPay/server/SystemConfig/addRole',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: roleInfo
    })
}

export function getRoleInfoByRoleId(roleId) {
    return service({
        url: '/api/pakGoPay/server/SystemConfig/getRoleInfoByRoleId',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        params: {
            roleId: roleId,
        }
    })
}
export function modifyRoleInfo(form) {
    return service({
        url: '/api/pakGoPay/server/SystemConfig/modifyRoleInfo',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form,
    })
}

export function deleteRole(form) {
    return service({
        url: '/api/pakGoPay/server/SystemConfig/deleteRole',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form,
    })
}

export function getAllCurrencyType() {
    return service({
        url: '/api/pakGoPay/server/CurrencyTypeManagement/currencyTypeInfo',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
    })
}

export function getCurrencyById(id) {
    return service({
        url: '/api/pakGoPay/server/CurrencyTypeManagement/getCurrencyById',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        params: {
            id: id === undefined ? null : id,
        }
    })
}

export function addCurrencyType(form) {
    return service({
        url: '/api/pakGoPay/server/CurrencyTypeManagement/addCurrencyType',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        data: form,
    })
}

export function getMerchantReport(form) {
    return service({
        url: '/api/pakGoPay/server/queryMerchantReport',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form,
    })
}

export function getChannelReport(form) {
    return service({
        url: '/api/pakGoPay/server/queryChannelReport',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form,
    })
}

export function getAgentReport(form) {
    return service({
        url: '/api/pakGoPay/server/queryAgentReport',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form,
    })
}

export function getCurrencyReport(form) {
    return service({
        url: '/api/pakGoPay/server/queryCurrencyReport',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form,
    })
}

export function exportMerchantReport(form) {
    return service({
        url: '/api/pakGoPay/server/exportMerchantReport',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        responseType: 'blob',
        data: form,
    })
}

export function exportAgentReport(form) {
    return service({
        url: '/api/pakGoPay/server/exportAgentReport',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        responseType: 'blob',
        data: form,
    })
}

export function exportCurrencyReport(form) {
    return service({
        url: '/api/pakGoPay/server/exportCurrencyReport',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        responseType: 'blob',
        data: form,
    })
}

export function exportChannelReport(form) {
    return service({
        url: '/api/pakGoPay/server/exportChannelReport',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        responseType: 'blob',
        data: form,
    })
}

export function getPaymentInfo(form) {
    return service({
        url: '/api/pakGoPay/server/queryPayment',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form,
    })
}