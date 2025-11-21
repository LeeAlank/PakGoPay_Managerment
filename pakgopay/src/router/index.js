import { createRouter, createWebHistory } from "vue-router"
import PakGoPay from "../components/PakGoPay.vue"
import ABOUT from "../components/ABOUT.vue"
import LOGIN from "../views/login/Login.vue"
import HOME from "../views/Home.vue"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "default",
            meta: {
                keepAlive: false
            },
            redirect: "/web/login"
        },
        {
            path: "/login",
            name: "default",
            meta: {
                keepAlive: false
            },
            redirect: "/web/login"
        },
        {
            path: "/web/login",
            name: "login",
            meta: {
                needLogin: false,
                title: "Login",
            },
            component: LOGIN
        },
        {
            path: '/web/pakGoPay',
            name: "pakGoPay",
            component: PakGoPay,
            meta: {
                needLogin: true,
                title: "Pak GoPay",
            },
            children: [
                {
                    path: "/welcome",
                    name: "welcome",
                    meta: {
                        keepAlive: false,
                        needLogin: true,
                        title: "Welcome",
                    },
                    component: PakGoPay
                },
                {
                    path: "/about",
                    name: "About",
                    meta: {
                        keepAlive: false,
                        needLogin: true,
                        title: '游戏'
                    },
                    component: ABOUT
                },
                {
                    path: "/home",
                    name: "home",
                    meta: {
                        needLogin: false,
                        title: "首页",
                    },
                    component: HOME
                },
            ]
        },
    ]

})

export default router