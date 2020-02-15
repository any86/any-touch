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
        path: '/pan',
        name: 'Pan',
        component: () => import( /* webpackChunkName: "pan" */ '../views/Pan.vue')
    }
]

const router = new VueRouter({
    routes
})

export default router