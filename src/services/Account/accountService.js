import { HTTP } from '../../http';
const accountUrl = process.env.VUE_APP_API_URI.concat('account/');
export default {
  signin: (email, password) => {
    return new Promise((resolve, reject) => {
      const model = {
        email: email,
        password: password
      };
      HTTP.post(accountUrl.concat('login'), model).then(
        response => {
          resolve(response);
        },
        error => {
          reject(error);
        }
      );
    });
  }
};
