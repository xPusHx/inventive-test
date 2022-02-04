const initRouterGuards = router => {
    router.beforeEach((routeTo, routeFrom, next) => {
        document.title = routeTo.meta.title;
        next();
    });
};

export default initRouterGuards;