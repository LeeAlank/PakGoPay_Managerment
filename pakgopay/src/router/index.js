import { createRouter, createWebHistory } from "vue-router"
import PAKGOPAY from "../components/PakGoPay.vue"
import ABOUT from "../components/ABOUT.vue"
import LOGIN from "../views/login/Login.vue"
import HOME from "../views/Home.vue"
import MerchantReport from "@/views/pages/MerchantReport.vue";
import ChannelReport from "@/views/pages/ChannelReport.vue";
import {START_LOCATION_NORMALIZED as route} from "vue-router/dist/devtools-BLCumUwL.mjs";
import {menu, refreshAccessToken} from "@/api/interface/backendInterface.js";
import {getAsyncRoutes} from "@/router/asyncRouter.js";

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
            redirect: "/web/login"
        },
        {
            path: "/web/login",
            name: "login",
            meta: {
                needLogin: false,
                title: "Login",
                showBar: true
            },
            component: LOGIN
        },
        {
            path: '/web/pakGoPay',
            name: "pakGoPay",
            component: PAKGOPAY,
            meta: {
                needLogin: true,
                title: "Pak GoPay",
            },
        }
        /*{
            path: "/web/pakGoPay/MerchantReport",
            name: "MerchantReport",
            meta: {
                needLogin: true,
                title: "商户报表",
            },
            component: MerchantReport
        },*/
        /*{
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
                showBar: true
            },
            component: LOGIN
        },
        {
            path: '/web/pakGoPay',
            name: "pakGoPay",
            component: PAKGOPAY,
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
                    component: PAKGOPAY
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
        {
            menuId: "001",
            path: "/web/pakGoPay/MerchantReport",
            name: "MerchantReport",
            meta: {
                needLogin: true,
                title: "商户报表",
            },
            component: MerchantReport
        },
        {
            path: "/web/ChannelReport",
            name: "ChannelReport",
            meta: {
                needLogin: true,
                title: "渠道报表",
            },
            component: ChannelReport
        },*/
    ]

})
/*router.beforeEach((to, from, next) => {
     /!*if (localStorage.getItem("menu")) {
         getAsyncRoutes(JSON.parse(localStorage.getItem("menu"))).forEach((route) => {
             router.addRoute(route)
         })
     } else {
         menu().then(res => {
             if (res.status === 200 && res.data.data) {
                 let menu = JSON.stringify(JSON.parse(res.data.data))
                 localStorage.setItem('menu', menu)
                 // 根据菜单提取路由
                 getAsyncRoutes(menu).forEach((route) => {
                     router.addRoute(route)
                 })
             }
         })
     }
    const currentPath = to.path
    if (currentPath !== '/') {
        localStorage.setItem("currentPath", currentPath);
        router.push({path: currentPath})
    }
    next();*!/
    next();
});
window.addEventListener('load', () => {
    const currentPath = localStorage.getItem("currentPage");
    if (currentPath) {
        console.log("go to before path", currentPath)
        router.push(currentPath);
    }
});*/

router.beforeEach((to, from, next) => {
    if (to.path === "/web/login"){
        next()
    } else if (to.path === "/") {
        next("/web/login")
    } else if (!localStorage.getItem("token")) {
        next("/web/login")
    } else {
        localStorage.setItem("currentPath", to.path)
        next()
    }

});

window.addEventListener('load', () => {
    const currentPath = localStorage.getItem("currentPath");
    menu().then(res => {
        if (res.status === 200 && res.data.data) {
            let menuJson = JSON.parse(res.data.data)
            let menu = JSON.stringify(JSON.parse(res.data.data))
            localStorage.setItem('menu', menu)
            // 根据菜单提取路由
            getAsyncRoutes(menuJson).forEach((route) => {
                router.addRoute(route)
            })
        } else if (res.status === 401) {
            // token过期，重新刷新token
            refreshAccessToken(localStorage.getItem('refreshToken')).then(res => {
                if (res.data.code === 1008) {
                    router.push("/web/login").then(r => {})
                }
            localStorage.setItem("token", res.data.data.token);
             menu().then(res => {})
            })
        }
        if (currentPath) {
            router.push(currentPath).then(r => {});
        }
    })

});
export default router