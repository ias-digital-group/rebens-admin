import { HTTP } from '../../http';
import config from '../../config';
export default {
  findAll: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : { page: 0, pageItems: 30, searchWord: '', sort: 'Name ASC' };
      HTTP.get(
        config.apiEndpoints.coursePeriodUri.concat(
          `?page=${request.page}&pageItems=${request.pageItems}&searchWord=${
            request.searchWord
          }&sort=${request.sort}${
            request.idOperation ? '&idOperation=' + request.idOperation : ''
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
  get: id => {
    return new Promise((resolve, reject) => {
      HTTP.get(config.apiEndpoints.coursePeriodUri.concat(id)).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  create: model => {
    return new Promise((resolve, reject) => {
      HTTP.post(config.apiEndpoints.coursePeriodUri, model).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  update: model => {
    return new Promise((resolve, reject) => {
      HTTP.put(config.apiEndpoints.coursePeriodUri, model).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  delete: id => {
    return new Promise((resolve, reject) => {
      HTTP.delete(config.apiEndpoints.coursePeriodUri.concat(id)).then(
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
