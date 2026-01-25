import App from '@/App.vue'

export function getAsyncRoutes(routes) {
    let modules = import.meta.glob('@/views/**/*.vue',{eager: true})
    let routesMap = [];

    routes.forEach(route => {
        if(route.children && route.children.length > 0) {
            route.children.forEach(child => {
                if (child.parentId) {
                   /* if (child.component === 'CollectingOrder') {
                        alert(child.path)
                    }*/
                    routesMap.push({
                        path: child.path,
                        name: child.component,
                        /*component: import((`../views/pages/${child.component}.vue`)),*/
                        component: modules[`/src/views/pages/${child.component}.vue`].default,
                        meta: child.meta,
                        redirect: child.redirect,
                    })
                }
            })
        }
    })
    return routesMap;
}