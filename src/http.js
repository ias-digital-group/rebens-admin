import axios from 'axios';
import store from './store';
import router from './routes/router';

const instance = axios.create({
  headers: {
    Accept: 'application/json'
  }
});

// Add a request interceptor
instance.interceptors.request.use(
  config => {
    config.headers.common['Authorization'] = `Bearer ${
      store.getters.accessToken
    }`;
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
        store.dispatch('removeUser');
        router.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

export const HTTP = instance;
