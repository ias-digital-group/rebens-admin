import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user/index.js';
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user
  },
  strict: true // process.env.NODE_ENV !== 'production'
});
