import { HTTP } from '../../http';
import config from '../../config';

export default {
  findAll: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : {
            page: 0,
            pageItems: 30,
            searchWord: '',
            idOperation: '',
            plan: '',
            status: ''
          };
      HTTP.get(
        config.apiEndpoints.wirecardUri.concat(
          `?page=${request.page}&pageItems=${request.pageItems}
            &searchWord=${request.searchWord}
            &idOperation=${request.idOperation}
            &plan=${
              request.plan == null || request.plan == undefined
                ? ''
                : request.plan
            }
            &status=${
              request.status == null || request.status == undefined
                ? ''
                : request.status
            }`
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
  generateExcel: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : {
            searchWord: '',
            idOperation: ''
          };
      HTTP.get(
        config.apiEndpoints.wirecardUri.concat(
          `GenerateExcel?searchWord=${request.searchWord}&idOperation=${
            request.idOperation
          }
          &plan=${
            request.plan == null || request.plan == undefined
              ? ''
              : request.plan
          }
          &status=${
            request.status == null || request.status == undefined
              ? ''
              : request.status
          }`
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
  }
};
