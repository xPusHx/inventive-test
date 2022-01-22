const initRouterGuards = router => {
    router.beforeEach((routeTo, routeFrom, next) => {
        return next();
    });
};

export default initRouterGuards;