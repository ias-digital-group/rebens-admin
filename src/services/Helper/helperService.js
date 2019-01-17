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
  }
};
