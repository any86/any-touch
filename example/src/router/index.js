import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/target',
        name: 'target',
        component: () => import('../views/Target.vue')
    },

    {
        path: '/p',
        name: 'p',
        component: () => import('../views/P.vue')
    },
    {
        path: '/parent',
        name: 'parent',
        component: () => import('../views/ParentChild.vue')
    },
    {
        path: '/use',
        name: 'use',
        component: () => import('../views/Use.vue')
    },
    {
        path: '/topology',
        name: 'Topology',
        component: () => import('../views/Topology.vue')
    }
];

const router = new VueRouter({
    routes
});

export default router;
