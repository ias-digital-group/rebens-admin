import axios from 'axios';
const accountUrl = process.env.VUE_APP_API_URI.concat('account/');

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
      http.post(accountUrl.concat('login'), model).then(
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
