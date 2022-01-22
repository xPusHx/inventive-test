import Vue from 'vue';
import VueRouter from 'vue-router';

import routesObject from './routes.js';
import initRouterGuards from './guards.js';

Vue.use(VueRouter);

const routes = [];

Object.keys(routesObject).forEach(route => {
    const currentPage = routesObject[route];

    const pageName = currentPage.name || route;
    const path = currentPage.path || `/${route}`;
    const component = currentPage.component;
    const title = currentPage.title;

    const pageOptions = {
        name: pageName,
        path,
        component,
        meta: {
            title
        }
    };

    routes.push(pageOptions);
});

const router = new VueRouter({
    routes,
    mode: 'history'
});

initRouterGuards(router);

export default router;