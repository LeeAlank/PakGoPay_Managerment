//import SockJS from 'sockjs-client'
import SockJS from 'sockjs-client/dist/sockjs.min.js';
import Stomp from 'stompjs'

let stompClient = null;
let reconnectTimer = null;
const RETRY_TIMEOUT = 5000; // reconnect time 5s

/**
 * connect websocket
 */
export function connectWebSocket(topic, onMessageCallback, refreshCallback) {
    const socket = new SockJS('http://localhost:8090/pakGoPay/server/notify');
    const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
    stompClient = Stomp.over(socket);
    stompClient.connect(headers, () =>{
        console.log("WebSocket Connected");
        if (reconnectTimer) clearTimeout(reconnectTimer);

        stompClient.subscribe(`/topic/${topic}`, (message) => {
            onMessageCallback(message.body);
            //refreshCallback(); // freshdata when get message
        });
        // refreshCallback();  连接成功时刷新数据
    },
        (error) => {
        console.error('WebSocket Connect Error, will retry reconnect......', error);
        scheduleReconnect(topic, onMessageCallback, refreshCallback);
        })
}

function scheduleReconnect(topic, onMessageCallback, refreshCallback) {
    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(() => {
        connectWebSocket(topic, onMessageCallback, refreshCallback);
    },
        RETRY_TIMEOUT);
}

export function disconnectWebSocket(topic, onMessageCallback, refreshCallback) {
    if (stompClient) {
        stompClient.disconnect();
        console.log("WebSocket connection is disconnected");
    }
    if (reconnectTimer) clearTimeout(reconnectTimer);
}