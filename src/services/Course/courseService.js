import { HTTP } from '../../http';
import config from '../../config';

export default {
  findAll: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : { page: 0, pageItems: 30, searchWord: '', sort: 'Question ASC' };
      HTTP.get(
        config.apiEndpoints.courseUri.concat(
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
      HTTP.get(config.apiEndpoints.courseUri.concat(id)).then(
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
      HTTP.post(config.apiEndpoints.courseUri, model).then(
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
      HTTP.put(config.apiEndpoints.courseUri, model).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
          console.error('update', error);
        }
      );
    });
  },
  delete: id => {
    return new Promise((resolve, reject) => {
      HTTP.delete(config.apiEndpoints.courseUri.concat(id)).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  listFaqs: function() {
    return new Promise((resolve, reject) => {
      HTTP.get(config.apiEndpoints.courseUri.concat('items/17')).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  listRegulations: function() {
    return new Promise((resolve, reject) => {
      HTTP.get(config.apiEndpoints.courseUri.concat('items/18')).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  changeActive: function(id, active) {
    return new Promise((resolve, reject) => {
      HTTP.post(config.apiEndpoints.courseUri.concat(`changeActive/${id}/${active}`)).then(
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
