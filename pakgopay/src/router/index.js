import { createRouter, createWebHistory } from "vue-router"
import PAKGOPAY from "../components/PakGoPay.vue"
import LOGIN from "../views/login/LoginNew.vue"
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

let asyncRoutesLoaded = false;

router.beforeEach(async (to, from, next) => {
    if (to.path === "/web/login") {
        next()
        return
    }
    if (to.path === "/") {
        next("/web/login")
        return
    }
    if (!localStorage.getItem("token")) {
        next("/web/login")
        return
    }

    if (!asyncRoutesLoaded) {
        try {
            const res = await menu()
            if (res.status === 200 && res.data.data) {
                let menuJson = JSON.parse(res.data.data)
                let menuString = JSON.stringify(menuJson)
                localStorage.setItem('menu', menuString)
                getAsyncRoutes(menuJson).forEach((route) => {
                    router.addRoute(route)
                })
                asyncRoutesLoaded = true
                next({ ...to, replace: true })
                return
            }
            if (res.status === 401) {
                const refreshRes = await refreshAccessToken(localStorage.getItem('refreshToken'))
                if (refreshRes.data.code === 1008) {
                    next("/web/login")
                    return
                }
                localStorage.setItem("token", refreshRes.data.data.token)
                const menuRes = await menu()
                let menuJson = JSON.parse(menuRes.data.data)
                let menuString = JSON.stringify(menuJson)
                localStorage.setItem('menu', menuString)
                getAsyncRoutes(menuJson).forEach((route) => {
                    router.addRoute(route)
                })
                asyncRoutesLoaded = true
                next({ ...to, replace: true })
                return
            }
        } catch (error) {
            next(false)
            return
        }
    }

    localStorage.setItem("currentPath", to.path)
    next()
});
export default router
