import App from '@/App.vue'

export function getAsyncRoutes(routes) {
    let modules = import.meta.glob('@/views/**/*.vue')
    let routesMap = [];
    routes.forEach(route => {
        if(route.children && route.children.length > 0) {
            route.children.forEach(child => {
                if (child.parentId) {
                    routesMap.push({
                        path: child.path,
                        name: child.component,
                        component: import((`../views/pages/${child.component}.vue`)),
                        meta: child.meta,
                        redirect: child.redirect,
                    })
                }
            })
        }
    })
    return routesMap;
}