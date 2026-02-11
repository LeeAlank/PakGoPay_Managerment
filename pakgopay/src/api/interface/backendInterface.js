import service from '../axios.js'
import router from "@/router/index.js";
import formData from "axios/unsafe/env/classes/FormData.js";


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
        },
        skip401Handler: true
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
                localStorage.removeItem("refreshToken")
                localStorage.removeItem("ops_common_message_shown")
                const coreNames = new Set(["default", "login", "pakGoPay"]);
                router.getRoutes().forEach(route => {
                    if (route.name && !coreNames.has(route.name)) {
                        router.removeRoute(route.name);
                    }
                })
                router.push("/web/login").then()
            } else {
                this.$notify({
                    title: this.$t('common.error'),
                    message: this.$t('common.requestFailed'),
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

export async function getMerchantInfo(form) {
    return service({
        url: '/api/pakGoPay/server/merchant/queryMerchant',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: form,
        responseType: 'json',
    })
}

export async function createMerchantAccount(form) {
    return service({
        url: '/api/pakGoPay/server/merchant/addMerchantAccount',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: form,
        responseType: 'json',
    })
}

export async function getMerchantAccount(form) {
    return service({
        url: '/api/pakGoPay/server/merchant/queryMerchantAccount',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: form,
        responseType: 'json',
    })
}

export async function modifyMerchantAccount(form) {
    return service({
        url: '/api/pakGoPay/server/merchant/editMerchantAccount',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: form,
        responseType: 'json',
    })
}

export async function createMerchantInfo(form) {
    return service({
        url: '/api/pakGoPay/server/merchant/addMerchant',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: form,
        responseType: 'json',
    })
}

export async function modifyMerchantInfo(form) {
    return service({
        url: '/api/pakGoPay/server/merchant/editMerchant',
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

export async function loginUserList(formData) {
    return service({
        url: '/api/pakGoPay/server/SystemConfig/loginUserList',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: formData,
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

export function resetGoogleKey(user_id, googleCode, loginName) {
    return service({
        url: '/api/pakGoPay/server/SystemConfig/resetGoogleKey',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: {
            userId: user_id,
            googleCode: googleCode,
            loginName: loginName
        }
    })
}

export function bindGoogleKey(user_id, loginName) {
    return service({
        url: '/api/pakGoPay/server/SystemConfig/bindGoogleKey',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: {
            userId: user_id,
            loginName: loginName
        }
    })
}

export function getTelegramConfig() {
    return service({
        url: '/api/pakGoPay/server/SystemConfig/telegramConfig',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
}

export function updateTelegramConfig(form) {
    return service({
        url: '/api/pakGoPay/server/SystemConfig/telegramConfig',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        data: form,
    })
}

export function getCommonMessage() {
    return service({
        url: '/api/pakGoPay/server/SystemConfig/unCommonMessage',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        params: {
            userName: localStorage.getItem('userName'),
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
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: {
            allData: true,
        },
    })
}

export function getCurrencyTypeByPage(form) {
    return service({
        url: '/api/pakGoPay/server/CurrencyTypeManagement/currencyTypeInfo',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form,
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
            'Content-Type': 'application/json;charset=UTF-8',
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

export function getPaymentReport(form) {
    return service({
        url: '/api/pakGoPay/server/queryPaymentReport',
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

export function exportPaymentReport(form) {
    return service({
        url: '/api/pakGoPay/server/exportPaymentReport',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        responseType: 'blob',
        data: form,
    })
}

export function exportPayment(form) {
    return service({
        url: '/api/pakGoPay/server/exportPayment',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        responseType: 'blob',
        data: form,
    })
}

export function exportMerchantAccount(form) {
    return service({
        url: '/api/pakGoPay/server/merchant/exportMerchantAccount',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        responseType: 'blob',
        data: form,
    })
}

export function exportAgentInfo(form) {
    return service({
        url: '/api/pakGoPay/server/exportAgent',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        responseType: 'blob',
        data: form,
    })
}

export function exportAgentAccount(form) {
    return service({
        url: '/api/pakGoPay/server/exportAgentAccount',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        responseType: 'blob',
        data: form,
    })
}

export function exportChannelList(form) {
    return service({
        url: '/api/pakGoPay/server/exportChannel',
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
        data: form
    })
}

export function editPaymentInfo(form) {
    return service({
        url: '/api/pakGoPay/server/editPayment',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function createPaymentInfo(form) {
    return service({
        url: '/api/pakGoPay/server/addPayment',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function getChannelInfo(form) {
    return service({
        url: '/api/pakGoPay/server/queryChannel',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function modifyChannelInfo(form) {
    return service({
        url: '/api/pakGoPay/server/editChannel',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function createChannelInfo(form) {
    return service({
        url: '/api/pakGoPay/server/addChannel',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function createAgentInfo(form) {
    return service({
        url: '/api/pakGoPay/server/addAgent',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function modifyAgentInfo(form) {
    return service({
        url: '/api/pakGoPay/server/editAgent',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function getAgentInfo(form) {
    return service({
        url: '/api/pakGoPay/server/queryAgent',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function getAgentAccountInfo(form) {
    return service({
        url: '/api/pakGoPay/server/queryAgentAccount',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function createAgentAccountInfo(form) {
    return service({
        url: '/api/pakGoPay/server/addAgentAccount',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function modifyAgentAccountInfo(form) {
    return service({
        url: '/api/pakGoPay/server/editAgentAccount',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function createStatementeOrderApply(form) {
    return service({
        url: '/api/pakGoPay/server/merchant/createAccountStatement',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function getWsMessages() {
    return service({
        url: '/api/pakGoPay/server/notation/queryNotation',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
    })
}

export function markReadMessage(messageId) {
    return service({
        url: '/api/pakGoPay/server/notation/markNotation',
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        params: {
            messageId: messageId
        }
    })
}

export function getWithdrawStatementeOrder(form) {
    return service({
        url: '/api/pakGoPay/server/merchant/queryAccountStatement',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function modifyWithdrawStatementeOrder(form) {
    return service({
        url: '/api/pakGoPay/server/merchant/editAccountStatement',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function getCollectionOrder(form) {
    return service({
        url: '/api/pakGoPay/server/v1/queryCollectionOrders',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function getPayingOrder(form) {
    return service({
        url: '/api/pakGoPay/server/v1/queryPayOutOrders',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function queryOpsOrderCardInfo(form) {
    return service({
        url: '/api/pakGoPay/server/queryOpsOrderCardInfo',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function getOpsDailyReport(form) {
    return service({
        url: '/api/pakGoPay/server/queryOpsDailyReport',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function getOpsMonthlyReport(form) {
    return service({
        url: '/api/pakGoPay/server/queryOpsMonthlyReport',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}

export function getOpsYearlyReport(form) {
    return service({
        url: '/api/pakGoPay/server/queryOpsYearlyReport',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data: form
    })
}
