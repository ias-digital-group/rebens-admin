import _ from 'lodash';
import axios from 'axios';

const types = {
  SET_PAGE_SETTINGS: 'setPageSettings',
  SAVE_AUTH_DATA: 'saveAuthData',
  CLEAR_AUTH_DATA: 'clearAuthData'
};

const state = {
  pageSettings: {
    pages: []
  },
  accessToken: localStorage.getItem('token') || '',
  user: {}
};
const mutations = {
  setPageSetting(state, settings) {
    _.remove(state.pageSettings.pages, function(o) {
      return o.name == settings.name;
    });
    state.pageSettings.pages.push(settings);
  },
  saveAuthData(state, user, accessToken) {
    state.accessToken = accessToken;
    state.user = user;
  },
  clearAuthData(state) {
    state.accessToken = '';
    state.user = {};
    delete axios.defaults.headers.common['Authorization'];
  }
};

const getters = {
  getPageSettings: state => pageName => {
    if (state.pageSettings && state.pageSettings.pages) {
      const c = _.find(state.pageSettings.pages, function(o) {
        return o.name == pageName;
      });
      return c ? c : null;
    }
    return null;
  },
  currentUser: state => {
    return state.user;
  },
  isAuthenticated: state => {
    return state.accessToken != '';
  },
  accessToken: state => {
    return state.accessToken;
  }
};

const actions = {
  setUser({ commit }, signinResponse) {
    return new Promise(resolve => {
      const user = {
        accessToken: signinResponse.token.accessToken,
        name: signinResponse.user.name,
        email: signinResponse.user.email,
        id: signinResponse.user.id,
        role: signinResponse.role
      };
      // axios.defaults.headers.common['Authorization'] = `Bearer ${
      //   signinResponse.token.accessToken
      // }`;
      localStorage.setItem('token', signinResponse.token.accessToken);
      commit(types.SAVE_AUTH_DATA, user);
      resolve();
    });
  },
  removeUser({ commit }) {
    return new Promise(resolve => {
      commit(types.CLEAR_AUTH_DATA);
      resolve();
    });
  }
};

export default {
  state,
  mutations,
  getters,
  actions
};
