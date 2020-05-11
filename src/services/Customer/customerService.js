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
            request.idOperation ? '&idOperation=' + request.idOperation : ''
          }${
            request.idOperationPartner
              ? '&idOperationPartner=' + request.idOperationPartner
              : ''
          }${request.status ? '&status=' + request.status : ''}${
            request.active ? '&active=' + request.active : ''
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
