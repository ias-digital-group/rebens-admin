import { HTTP } from '../../http';
import config from '../../config';

export default {
  findAll: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : { page: 0, pageItems: 30, searchWord: '', sort: 'name ASC', idOperation:0 };
      HTTP.get(
        config.apiEndpoints.operationPartnerUri.concat(
          `?page=${request.page}&pageItems=${request.pageItems}&searchWord=${
            request.searchWord
          }&sort=${request.sort}&idOperation=${request.idOperation}`
        )
      ).then(
        response => {
          _.each(response.data.data, function(el) {
            el.statusName = el.active ? 'ativo' : 'inativo';
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
      HTTP.get(config.apiEndpoints.operationPartnerUri.concat(id)).then(
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
      HTTP.post(config.apiEndpoints.operationPartnerUri, model).then(
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
      HTTP.put(config.apiEndpoints.operationPartnerUri, model).then(
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
      HTTP.delete(config.apiEndpoints.operationPartnerUri.concat(id)).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  findAllCustomers: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : { page: 0, pageItems: 30, searchWord: '', sort: 'name ASC', idOperation: undefined, status: undefined, idOperationPartner: undefined };
      HTTP.get(
        config.apiEndpoints.operationPartnerUri.concat(
          `ListCustomers?page=${request.page}&pageItems=${request.pageItems}&searchWord=${
            request.searchWord
          }&sort=${request.sort}&idOperation=${
            (request.idOperation ? request.idOperation : '')
          }&status=${(request.status ? request.status : '')}&idOperationPartner=${
            (request.idOperationPartner ? request.idOperationPartner : '')
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
  changeCustomerStatus: request => {
    return new Promise((resolve, reject) => {
      HTTP.put(
        config.apiEndpoints.operationPartnerUri.concat(`UpdateCustomerStatus?idCustomer=${request.id}&status=${request.status}`)
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
