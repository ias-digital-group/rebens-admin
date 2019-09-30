import axios from 'axios';
import config from '../../config';

const http = axios.create({
  headers: {
    Accept: 'application/json'
  }
});

export default {
  signin: (email, password) => {
    return new Promise((resolve, reject) => {
      const model = {
        email: email,
        password: password
      };
      http.post(config.apiEndpoints.accountUri.concat('login'), model).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  validate: (code, password, passwordConfirm) => {
    return new Promise((resolve, reject) => {
      const model = {
        code: code, 
        password: password,
        passwordConfirm: passwordConfirm
      };
      http.post(config.apiEndpoints.accountUri.concat('validate'), model).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  changePassword: (request) => {
    return new Promise((resolve, reject) => {
      http.post(config.apiEndpoints.accountUri.concat('ChangePassword'), request).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  rememberPassword: (email) => {
    return new Promise((resolve, reject) => {
      http.get(config.apiEndpoints.accountUri.concat(`RememberPassword/?email=${encodeURIComponent(email)}`)).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  }
};
