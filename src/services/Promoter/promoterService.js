import { HTTP } from '../../http';
import config from '../../config';

export default {
  list: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : {
            page: 0,
            pageItems: 30,
            searchWord: '',
            sort: 'name ASC',
            status: ''
          };
      HTTP.get(
        config.apiEndpoints.promoterUri.concat(
          `?page=${request.page}&pageItems=${request.pageItems}&searchWord=${request.searchWord}&sort=${request.sort}&status=${request.status}`
        )
      ).then(
        response => {
          resolve(response.data);
        },
        error => {
          if (error.response.status === 400) {
            resolve(error.response.data);
          } else {
            reject(error);
          }
        }
      );
    });
  },
  get: id => {
    return new Promise((resolve, reject) => {
      HTTP.get(config.apiEndpoints.promoterUri.concat(id)).then(
        response => {
          resolve(response.data);
        },
        error => {
          if (error.response.status === 400) {
            resolve(error.response.data);
          } else {
            reject(error);
          }
        }
      );
    });
  },
  create: model => {
    return new Promise((resolve, reject) => {
      HTTP.post(config.apiEndpoints.promoterUri, model).then(
        response => {
          resolve(response.data);
        },
        error => {
          if (error.response.status === 400) {
            resolve(error.response.data);
          } else {
            reject(error);
          }
        }
      );
    });
  },
  report: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : {
            page: 0,
            pageItems: 30,
            searchWord: '',
            sort: 'name ASC',
            idOperation: ''
          };
      HTTP.get(
        config.apiEndpoints.promoterUri.concat(
          `report/?page=${request.page}&pageItems=${request.pageItems}&searchWord=${request.searchWord}&sort=${request.sort}` +
            (request.idOperation && request.idOperation !== ''
              ? `&idOperation=${request.idOperation}`
              : '')
        )
      ).then(
        response => {
          resolve(response.data);
        },
        error => {
          if (error.response.status === 400) {
            resolve(error.response.data);
          } else {
            reject(error);
          }
        }
      );
    });
  },
  resendValidation: id => {
    return new Promise((resolve, reject) => {
      HTTP.post(
        config.apiEndpoints.promoterUri.concat(`ResendValidation/${id}`)
      ).then(
        response => {
          resolve(response.data);
        },
        error => {
          if (error.response.status === 400) {
            resolve(error.response.data);
          } else {
            reject(error);
          }
        }
      );
    });
  }
};
