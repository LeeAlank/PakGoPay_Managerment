export function isValidIP(ipList) {
    ipList.replaceAll(' ','')
    const ips = ipList.split(',')
    for (let i = 0; i < ips.length; i++) {
        let ip = ips[i]
        if (isValidIPv4(ip) || isValidIPv6(ip)) {
            return true;
        } else {
            return false;
        }
    }
}

export function getMerchantReportTitle(i18n) {
    const Merchant_Report_Title = [
        {key: "merchantName", title: i18n.$t('exportReportTitle.merchantName')},
        {key: "orderQuantity", title: i18n.$t('exportReportTitle.orderQuantity')},
        {key: "orderSuccessRate", title: i18n.$t('exportReportTitle.orderSuccessRate')},
        {key:"successQuantity", title: i18n.$t('exportReportTitle.successQuantity')},
        {key:"merchantFee", title: i18n.$t('exportReportTitle.merchantFee')},
        {key:"agent1Fee", title:i18n.$t('exportReportTitle.agent1Fee')},
        {key:"agent2Fee", title:i18n.$t('exportReportTitle.agent2Fee')},
        {key:"agent3Fee", title:i18n.$t('exportReportTitle.agent3Fee')},
        {key:"orderProfit", title:i18n.$t('exportReportTitle.orderProfit')},
        {key:"currency", title:i18n.$t('exportReportTitle.currency')},
        {key:"timeDate", title:i18n.$t('exportReportTitle.timeDate')},
    ]
    return Merchant_Report_Title
}

export function getChannelReportTitle(i18n) {
    const Channel_Report_Title = [
        {key:"channelName", title: i18n.$t('exportReportTitle.channelName')},
        {key:"orderQuantity", title: i18n.$t('exportReportTitle.orderQuantity')},
        {key:"orderSuccessRate", title: i18n.$t('exportReportTitle.orderSuccessRate')},
        {key:"failedQuantity", title: i18n.$t('exportReportTitle.failedQuantity')},
        {key:"successQuantity", title: i18n.$t('exportReportTitle.successQuantity')},
        {key:"merchantFee", title: i18n.$t('exportReportTitle.merchantFee')},
        {key:"orderProfit", title: i18n.$t('exportReportTitle.orderProfit')},
        {key:"currency", title: i18n.$t('exportReportTitle.currency')},
        {key:"timeDate", title: i18n.$t('exportReportTitle.timeDate')},
    ]
    return Channel_Report_Title
}

export function getAgentReportTitle(i18n) {
    const Agent_Report_Title = [
        {key:"agentName", title: i18n.$t('exportReportTitle.agentName')},
        {key:"orderQuantity", title: i18n.$t('exportReportTitle.orderQuantity')},
        {key:"orderSuccessRate", title: i18n.$t('exportReportTitle.orderSuccessRate')},
        {key:"failedQuantity", title: i18n.$t('exportReportTitle.failedQuantity')},
        {key:"successQuantity", title: i18n.$t('exportReportTitle.successQuantity')},
        {key:"commission", title: i18n.$t('exportReportTitle.commission')},
        {key:"currency", title: i18n.$t('exportReportTitle.currency')},
        {key:"timeDate", title: i18n.$t('exportReportTitle.timeDate')},
    ]
    return Agent_Report_Title
}

export function getCurrencyReportTitle(i18n) {
    const Currency_Report_Title = [
        {key: "currency", title: i18n.$t('exportReportTitle.currency')},
        {key: "orderQuantity", title: i18n.$t('exportReportTitle.orderQuantity')},
        {key: "orderSuccessRate", title: i18n.$t('exportReportTitle.orderSuccessRate')},
        {key: "failedQuantity", title: i18n.$t('exportReportTitle.failedQuantity')},
        {key: "successQuantity", title: i18n.$t('exportReportTitle.successQuantity')},
        {key: "merchantFee", title: i18n.$t('exportReportTitle.merchantFee')},
        {key: "orderProfit", title: i18n.$t('exportReportTitle.orderProfit')},
        {key:'orderBalance', title: i18n.$t('exportReportTitle.orderBalance')},
        {key:"timeDate", title: i18n.$t('exportReportTitle.timeDate')},
    ]
    return Currency_Report_Title
}

export function getPaymentReportTitle(i18n) {
    const Payment_Report_Title = [
        {key:"paymentName", title: i18n.$t('exportReportTitle.paymentName')},
        {key:"paymentNo", title: i18n.$t('exportReportTitle.paymentNo')},
        {key:"orderQuantity", title: i18n.$t('exportReportTitle.orderQuantity')},
        {key:"orderSuccessRate", title: i18n.$t('exportReportTitle.orderSuccessRate')},
        {key:"failedQuantity", title: i18n.$t('exportReportTitle.failedQuantity')},
        {key:"successQuantity", title: i18n.$t('exportReportTitle.successQuantity')},
        {key:"merchantFee", title: i18n.$t('exportReportTitle.merchantFee')},
        {key:"orderProfit", title: i18n.$t('exportReportTitle.orderProfit')},
        {key:"orderBalance", title: i18n.$t('exportReportTitle.orderBalance')},
        {key:"currency", title: i18n.$t('exportReportTitle.currency')},
        {key:"timeDate", title: i18n.$t('exportReportTitle.timeDate')},
    ]
    return Payment_Report_Title
}

export function getFormateDate(ts) {
    const d = new Date(ts * 1000);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

export function getFormateTime() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function getFormateTimeByTimeBystamp(ts) {
    if (!ts) {
        return '';
    }
    const date = new Date(ts * 1000);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

export function getTimeFromTimestamp(timestamp) {
    if (!timestamp) {
        return '-';
    }
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let time = ''
    try {
        time = dayjs.unix(timestamp*1000).tz(timeZone).format('YYYY-MM-DD HH:mm:ss')
    } catch (e) {
        return '-';
    }
}
export function getDateFromTimestamp(timestamp) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return dayjs.unix(timestamp*1000).tz(timeZone).format('YYYY-MM-DD');
}

function isValidIPv4(ip) {
    const IPV4_REGEX =
        /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
    return IPV4_REGEX.test(ip);
}

function isValidIPv6(ip) {
    const IPV6_REGEX =
        /^((?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,7}:|(?:[0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,5}(?::[0-9A-Fa-f]{1,4}){1,2}|(?:[0-9A-Fa-f]{1,4}:){1,4}(?::[0-9A-Fa-f]{1,4}){1,3}|(?:[0-9A-Fa-f]{1,4}:){1,3}(?::[0-9A-Fa-f]{1,4}){1,4}|(?:[0-9A-Fa-f]{1,4}:){1,2}(?::[0-9A-Fa-f]{1,4}){1,5}|[0-9A-Fa-f]{1,4}:(?:(?::[0-9A-Fa-f]{1,4}){1,6})|:(?:(?::[0-9A-Fa-f]{1,4}){1,7}|:))$/;
    return IPV6_REGEX.test(ip);
}

export function loadingBody(that, loadingClassName) {
    const loadingInstance = that.$loading({
        lock: true,       // 设置进入加载
        text: 'loading...',           // 加载文字
        // spinner: 'el-icon-loading',
        // background: 'rgba(255, 255, 255, 0.7)',
        target: document.querySelector('.'+loadingClassName).querySelector('.el-table__body') // 指定加载动画覆盖的DOM节点
    })
    return loadingInstance
}

export function getTodayStartTimestamp() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return Math.floor(now.getTime() / 1000);
}

export async function exportExcel(res, fileName, that) {

    if (res.status === 200) {
        if (res.data.type === 'application/json') {
            const blobData = res.data;
            const jsonData = JSON.parse(await blobData.text())
            if (jsonData.code !== 0) {
                that.$notify({
                    title: 'Failed',
                    message: jsonData.message,
                    duration: 3000,
                    type: 'error',
                    position: 'bottom-right',
                })
            }
        } else {
            const blob = new Blob([res.data], {type: "application/vnd.ms-excel;charset=UTF-8"});
            console.log('blob---'+ blob.size)
            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(blob, fileName)
            } else {
                const downLoadElement = document.createElement('a');
                const href = window.URL.createObjectURL(blob);
                downLoadElement.href = href;
                downLoadElement.download = fileName;
                document.body.appendChild(downLoadElement);
                downLoadElement.click();
                document.body.removeChild(downLoadElement);
                window.URL.revokeObjectURL(href);
            }
            that.$notify({
                title: 'Success',
                message: 'export data success',
                duration: 3000,
                type: 'success',
                position: 'bottom-right',
            })
        }
    } else {
        if (res.data.type === 'application/json') {
            const blobData = res.data;
            const jsonData = JSON.parse(await blobData.text())
            that.$notify({
                title: 'Error',
                message: jsonData.message,
                duration: 3000,
                type: 'error',
                position: 'bottom-right',
            })
        }

    }
    this.filterbox.orderType = '0'

}
