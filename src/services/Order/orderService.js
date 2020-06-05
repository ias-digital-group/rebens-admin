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
            word: '',
            idOperation: ''
          };
      HTTP.get(
        config.apiEndpoints.orderUri.concat(
          `Validation?page=${request.page}&pageItems=${request.pageItems}&word=${request.word}` +
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
      HTTP.post(config.apiEndpoints.operationUri.concat(`Validate/${id}`)).then(
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
