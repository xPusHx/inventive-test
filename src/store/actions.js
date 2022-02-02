const mockJson = 'https://api.npoint.io/e8940572b59f7dfc63c4';

const actions = {
    fetchProducts({state, commit}) {
        return new Promise((resolve, reject) => {
            //Берём из стора
            if (state.products.length > 0) {
                resolve(state.products);
                return;
            }

            //Или берём с сервера
            return fetch(mockJson)
                .then(response => response.json())
                .then(data => {
                    const {products} = data;
                    commit('setProductsToState', products);
                    resolve(products);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    },

    deleteProduct({commit}, productId) {
        return new Promise(resolve => {
            //Тут идет запрос к серверу
            commit('deleteProduct', productId);
            resolve();
        });
    },
    resetProducts({state, commit}) {
        return new Promise(resolve => {
            //Тут идет запрос к серверу
            commit('resetProducts');
            resolve(state.products);
        });
    },

    addToWishlist({commit}, productId) {
        return new Promise(resolve => {
            //Тут идет запрос к серверу
            commit('addToWishlist', productId);
            resolve();
        });
    },
    removeFromWishlist({commit}, productId) {
        return new Promise(resolve => {
            //Тут идет запрос к серверу
            commit('removeFromWishlist', productId);
            resolve();
        });
    },
    clearWishlist({commit}) {
        return new Promise(resolve => {
            //Тут идет запрос к серверу
            commit('clearWishlist');
            resolve();
        });
    }
};

export default actions;