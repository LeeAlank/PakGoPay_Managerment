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

export function getTimeFromTimestamp(timestamp) {
    if (!timestamp) {
        return 'No data';
    }
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return dayjs.unix(timestamp).tz(timeZone).format('YYYY-MM-DD HH:mm:ss');
}
export function getDateFromTimestamp(timestamp) {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return dayjs.unix(timestamp).tz(timeZone).format('YYYY-MM-DD');
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
