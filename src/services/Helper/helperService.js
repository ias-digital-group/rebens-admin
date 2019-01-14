import { HTTP } from '../../http';

const operationUrl = process.env.VUE_APP_API_URI.concat('helper/');
export default {
  findAllOperationTypes: () => {
    return new Promise((resolve, reject) => {
      HTTP.get(operationUrl.concat('listOperationType')).then(
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
