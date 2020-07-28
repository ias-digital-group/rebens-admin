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
            idParent: '',
            type: '',
            level: ''
          };
      HTTP.get(
        config.apiEndpoints.categoryUri.concat(
          `?page=${request.page}&pageItems=${request.pageItems}&searchWord=${request.searchWord}` +
            `&sort=${request.sort}&active=${
              request.active == null || request.active == undefined
                ? ''
                : request.active
            }&idParent=${request.idParent}&type=${
              request.type == null || request.type == undefined
                ? ''
                : request.type
            }` +
            `&level=${
              request.level == null || request.level == undefined
                ? ''
                : request.level
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
      HTTP.get(config.apiEndpoints.categoryUri.concat(id)).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  getListTree: type => {
    return new Promise((resolve, reject) => {
      HTTP.get(
        config.apiEndpoints.categoryUri.concat(`ListTreeAdm/?type=${type}`)
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
  create: model => {
    return new Promise((resolve, reject) => {
      HTTP.post(config.apiEndpoints.categoryUri, model).then(
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
      HTTP.put(config.apiEndpoints.categoryUri, model).then(
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
      HTTP.delete(config.apiEndpoints.categoryUri.concat(id)).then(
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
        config.apiEndpoints.categoryUri.concat(`${id}/ToggleActive`)
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
  listAllActive: type => {
    return new Promise((resolve, reject) => {
      HTTP.get(
        config.apiEndpoints.categoryUri.concat(`ListAll/?type=${type}`)
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
