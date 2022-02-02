const mutations = {
    setProductsToState(state, products) {
        state.products = products;
    },

    deleteProduct(state, productId) {
        const deletedProduct = state.products.find(product => {
            return product.id === productId;
        });
        if (!deletedProduct) return;

        deletedProduct.deleted = true;
        deletedProduct.wishlisted = false;
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
        if (!wishlistedProduct) return;

        wishlistedProduct.wishlisted = true;
    },
    removeFromWishlist(state, productId) {
        const removedProduct = state.products.find(product => {
            return product.id === productId;
        });
        if (!removedProduct) return;

        removedProduct.wishlisted = false;
    },
    clearWishlist(state) {
        state.products.forEach(product => {
            product.wishlisted = false;
        });
    }
};

export default mutations;