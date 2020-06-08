import { HTTP } from '../../http';
import config from '../../config';

export default {
  findAllToValidate: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : {
            page: 0,
            pageItems: 30,
            searchWord: '',
            idOperation: ''
          };
      HTTP.get(
        config.apiEndpoints.orderUri.concat(
          `Validation?page=${request.page}&pageItems=${request.pageItems}&word=${request.searchWord}` +
            `&idOperation=${request.idOperation}`
        )
      ).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  validate: id => {
    return new Promise((resolve, reject) => {
      HTTP.post(config.apiEndpoints.orderUri.concat(`Validate/${id}`)).then(
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
