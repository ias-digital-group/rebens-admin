import { HTTP } from '../../http';
import config from '../../config';
import axios from 'axios';
export default {
  findAllOperationTypes: () => {
    return new Promise((resolve, reject) => {
      HTTP.get(config.apiEndpoints.helperUri.concat('listOperationType')).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  uploadFile: file => {
    return new Promise((resolve, reject) => {
      var formData = new FormData();
      formData.append('file', file);
      axios
        .post(config.apiEndpoints.helperUri.concat('uploadFile'), formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(
          response => {
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
    });
  },
  getNumbers: function(s) {
    const r = s.match(/\d+/g);
    if (r && r.length > 0) {
      return r[0];
    }
    return null;
  },
  getAddressFromZipCode: function(zipCode) {
    const n = this.getNumbers(zipCode);
    return new Promise((resolve, reject) => {
      if (n == null) {
        reject({ message: 'zipCode is invalid' });
      }
      const auth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];
      axios.get(config.apiEndpoints.viaCepUri.concat(`${n}/json`)).then(
        response => {
          axios.defaults.headers.common['Authorization'] = auth;
          resolve(response.data);
        },
        error => {
          axios.defaults.headers.common['Authorization'] = auth;
          reject(error);
        }
      );
    });
  }
};
