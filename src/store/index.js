import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions.js';
import getters from './getters.js';
import mutations from './mutations.js';
import state from './state.js';

Vue.use(Vuex);

const store = new Vuex.Store({
    actions,
    getters,
    mutations,
    state
});

export {
    store,
    actions,
    getters,
    mutations,
    state
};
export default store;