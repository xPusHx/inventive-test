import Vue from 'vue';
import router from '@/router';
import store from '@/store';

import {BootstrapVue, IconsPlugin} from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import App from '@/App.vue';

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});