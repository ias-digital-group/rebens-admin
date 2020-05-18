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
            active: '',
            type: '',
            idOperation: ''
          };
      if (request.active === null) request.active = '';
      if (request.type === null) request.type = '';
      if (request.idOperation === null) request.idOperation = '';
      HTTP.get(
        config.apiEndpoints.bannerUri.concat(
          `?page=${request.page}&pageItems=${request.pageItems}&searchWord=${request.searchWord}&sort=${request.sort}&active=${request.active}&type=${request.type}&idOperation=${request.idOperation}`
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
      HTTP.get(config.apiEndpoints.bannerUri.concat(id)).then(
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
      HTTP.post(config.apiEndpoints.bannerUri, model).then(
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
      HTTP.put(config.apiEndpoints.bannerUri, model).then(
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
      HTTP.delete(config.apiEndpoints.bannerUri.concat(id)).then(
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
        config.apiEndpoints.bannerUri.concat(`${id}/ToggleActive`)
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
