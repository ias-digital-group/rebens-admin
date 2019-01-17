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
  }
};
