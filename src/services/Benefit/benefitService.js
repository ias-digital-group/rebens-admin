import { HTTP } from '../../http';
import _ from 'lodash';
import config from '../../config';

export default {
  findAll: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : { page: 0, pageItems: 30, searchWord: '', sort: 'name ASC' };
      HTTP.get(
        config.apiEndpoints.benefitUri.concat(
          `?page=${request.page}&pageItems=${request.pageItems}&searchWord=${
            request.searchWord
          }&sort=${request.sort}`
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
      HTTP.get(config.apiEndpoints.benefitUri.concat(id)).then(
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
      HTTP.post(config.apiEndpoints.benefitUri, model).then(
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
      HTTP.put(config.apiEndpoints.benefitUri, model).then(
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
      HTTP.delete(config.apiEndpoints.benefitUri.concat(id)).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  findAllActive: () => {
    return new Promise((resolve, reject) => {
      HTTP.get(config.apiEndpoints.benefitUri.concat('active')).then(
        response => {
          console.log('findAllActive.response', response);
          resolve(response.data);
        },
        error => {
          console.log('findAllActive.error', error);
          reject(error);
        }
      );
    });
  }
};
