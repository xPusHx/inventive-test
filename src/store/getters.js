const getters = {
    hasDeleted(state) {
        const hasDeleted = state.products.some(product => {
            return product.deleted;
        });
        return hasDeleted;
    },

    wishlistCount(state) {
        const wishlistedProducts = state.products.filter(product => {
            return product.wishlisted;
        });
        return wishlistedProducts.length;
    }
};

export default getters;