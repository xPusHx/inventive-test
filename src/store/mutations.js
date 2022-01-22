const mutations = {
    setProductsToState(state, products) {
        state.products = products;
    },

    deleteProduct(state, productId) {
        const deletedProduct = state.products.find(product => {
            return product.id === productId;
        });

        deletedProduct.deleted = true;
        deletedProduct.wishlisted = true;
    },
    resetProducts(state) {
        state.products.forEach(product => {
            product.deleted = false;
        });
    },

    addToWishlist(state, productId) {
        const wishlistedProduct = state.products.find(product => {
            return product.id === productId;
        });

        wishlistedProduct.wishlisted = true;
    },
    removeFromWishlist(state, productId) {
        const removedProduct = state.products.find(product => {
            return product.id === productId;
        });

        removedProduct.wishlisted = false;
    }
};

export default mutations;