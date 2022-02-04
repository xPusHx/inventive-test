const mockJson = 'https://api.npoint.io/e8940572b59f7dfc63c4';

const actions = {
    async fetchProducts({state, commit}) {
        //Берём из стора
        if (state.products.length > 0) {
            return state.products;
        }

        //Или берём с сервера
        const response = await fetch(mockJson);
        const data = await response.json().catch(error => {
            throw error;
        });

        const {products} = data;
        commit('setProductsToState', products);
        return products;
    },

    async deleteProduct({commit}, productId) {
        //Тут идет запрос к серверу
        commit('deleteProduct', productId);
    },
    async resetProducts({state, commit}) {
        //Тут идет запрос к серверу
        commit('resetProducts');
        return state.products;
    },

    async addToWishlist({commit}, productId) {
        //Тут идет запрос к серверу
        commit('addToWishlist', productId);
    },
    async removeFromWishlist({commit}, productId) {
        //Тут идет запрос к серверу
        commit('removeFromWishlist', productId);
    },
    async clearWishlist({commit}) {
        //Тут идет запрос к серверу
        commit('clearWishlist');
    }
};

export default actions;