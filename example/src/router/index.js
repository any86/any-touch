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
        path: '/diy',
        name: 'diy',
        component: () => import('../views/DIY')
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
