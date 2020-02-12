import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/map',
        name: 'Map',
        component: () => import( /* webpackChunkName: "map" */ '../views/Map.vue')
    },
    {
        path: '/chart',
        name: 'Chart',
        component: () => import( /* webpackChunkName: "chart" */ '../views/Chart.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router