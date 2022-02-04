import Vue from 'vue';

const initRouterGuards = router => {
    router.beforeEach((routeTo, routeFrom, next) => {
        next();
    });

    router.afterEach(routeTo => {
        Vue.nextTick(() => {
            document.title = routeTo.meta.title;
        });
    });
};

export default initRouterGuards;