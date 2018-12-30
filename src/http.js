import axios from 'axios';
import Vue from 'vue';

const instance = axios.create({
  headers: {
    Accept: 'application/json'
  }
});

// Add a request interceptor
instance.interceptors.request.use(
  config => {
    config.headers.common['Authorization'] =
      'Bearer ' + Vue.prototype.$auth.currentUser.accessToken;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    if (error.response) {
      if (401 === error.response.status) {
        Vue.prototype.$auth.signin();
      }
    }
    return Promise.reject(error);
  }
);

export const HTTP = instance;
