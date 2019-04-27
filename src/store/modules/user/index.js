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
  user: JSON.parse(localStorage.getItem('portal.user')) || {}
};
const mutations = {
  setPageSetting(state, settings) {
    _.remove(state.pageSettings.pages, function(o) {
      return o.name == settings.name;
    });
    state.pageSettings.pages.push(settings);
  },
  saveAuthData(state, payload) {
    state.user = payload.user;
    state.token = payload.accessToken;
    localStorage.setItem('token', payload.accessToken);
    localStorage.setItem('portal.user', JSON.stringify(payload.user));
  },
  clearAuthData(state) {
    localStorage.removeItem('token');
    localStorage.removeItem('portal.user');
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
    return !!state.accessToken;
  },
  accessToken: state => {
    return state.accessToken;
  }
};

const actions = {
  setUser({ commit }, signinResponse) {
    const jwtData = JSON.parse(atob(signinResponse.accessToken.split('.')[1]));
    const user = {
      name: jwtData.Name,
      email: jwtData.unique_name[0],
      id: jwtData.Id,
      role: jwtData.role,
      idOperation: jwtData.operationId
    };
    // axios.defaults.headers.common['Authorization'] = `Bearer ${
    //   signinResponse.accessToken
    // }`;
    commit(types.SAVE_AUTH_DATA, {
      user: user,
      accessToken: signinResponse.accessToken
    });
  },
  removeUser({ commit }) {
    commit(types.CLEAR_AUTH_DATA);
  }
};

export default {
  state,
  mutations,
  getters,
  actions
};
