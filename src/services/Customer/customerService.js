import { HTTP } from '../../http';
import config from '../../config';
export default {
  findAll: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : {
            page: 0,
            pageItems: 10,
            searchWord: '',
            sort: 'name ASC',
            status: '',
            idOperation: '',
            idOperationPartner: '',
            active: ''
          };
      HTTP.get(
        config.apiEndpoints.customerUri.concat(
          `?page=${request.page}&pageItems=${request.pageItems}&searchWord=${
            request.searchWord
          }&sort=${request.sort}${
            request.idOperation != null && request.idOperation != undefined
              ? '&idOperation=' + request.idOperation
              : ''
          }${
            request.idOperationPartner != null &&
            request.idOperationPartner != undefined
              ? '&idOperationPartner=' + request.idOperationPartner
              : ''
          }${
            request.status != null && request.status != undefined
              ? '&status=' + request.status
              : ''
          }&active=${
            request.active != null && request.active != undefined
              ? request.active
              : ''
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
      HTTP.get(config.apiEndpoints.customerUri.concat(id)).then(
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
      HTTP.post(config.apiEndpoints.customerUri, model).then(
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
      if (model.gender === '') model.gender = null;
      HTTP.put(config.apiEndpoints.customerUri, model).then(
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
      HTTP.delete(config.apiEndpoints.customerUri.concat(id)).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  resendValidation: id => {
    return new Promise((resolve, reject) => {
      HTTP.get(
        config.apiEndpoints.customerUri.concat(`ResendValidation/${id}`)
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
  toggleActive: id => {
    return new Promise((resolve, reject) => {
      HTTP.post(
        config.apiEndpoints.customerUri.concat(`${id}/ToggleActive`)
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
