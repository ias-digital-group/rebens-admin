import { HTTP } from '../../http';
import config from '../../config';
import _ from 'lodash';

export default {
  findAll: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : {
            page: 0,
            pageItems: 10,
            searchWord: '',
            sort: 'Name ASC',
            active: '',
            role: '',
            idOperation: '',
            idOperationPartner: ''
          };
      HTTP.get(
        config.apiEndpoints.userUri.concat(
          `?page=${request.page}&pageItems=${request.pageItems}&searchWord=${
            request.searchWord
          }&sort=${request.sort}&active=${
            request.active != null && request.active != undefined
              ? request.active
              : ''
          }&role=${
            request.role != null && request.role != undefined
              ? request.role
              : ''
          }&idOperation=${
            request.idOperation != null && request.idOperation != undefined
              ? request.idOperation
              : ''
          }&idOperationPartner=${
            request.idOperationPartner != null &&
            request.idOperationPartner != undefined
              ? request.idOperationPartner
              : ''
          }`
        )
      ).then(
        response => {
          _.each(response.data.data, function(el) {
            el.activeName = el.active ? 'Sim' : 'Não';
          });
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
      HTTP.get(config.apiEndpoints.userUri.concat(id)).then(
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
      HTTP.post(config.apiEndpoints.userUri, model).then(
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
      HTTP.put(config.apiEndpoints.userUri, model).then(
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
      HTTP.delete(config.apiEndpoints.userUri.concat(id)).then(
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
        config.apiEndpoints.userUri.concat(`ResendValidation/${id}`)
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
      HTTP.post(config.apiEndpoints.userUri.concat(`${id}/ToggleActive`)).then(
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
