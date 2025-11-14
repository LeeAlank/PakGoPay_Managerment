import { createRouter, createWebHistory } from "vue-router"
import WELCOME from "@/components/First.vue"
import HOME from "@/App.vue"
import ABOUT from "@/components/ABOUT.vue"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/welcome",
            name: "welcome",
            meta: {
                keepAlive: false
            },
            component: WELCOME
        },
        {
            path: "/",
            name: "home",
            meta: {
                keepAlive: false
            },
            component: HOME
        },
        {
            path: "/about",
            name: "About",
            meta: {
                keepAlive: false
            },
            component: ABOUT
        }
    ]

})

export default router