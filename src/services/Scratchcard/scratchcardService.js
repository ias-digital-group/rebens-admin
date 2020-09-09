import { HTTP } from '../../http';
import axios from 'axios';
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
            status: '',
            idOperation: 0
          };
      HTTP.get(
        config.apiEndpoints.scratchcardUri.concat(
          `?page=${request.page}&pageItems=${request.pageItems}&searchWord=${request.searchWord}&sort=${request.sort}&status=${request.status}` +
            `${
              request.idOperation != null &&
              request.idOperation != undefined &&
              request.idOperation != 0
                ? '&idOperation=' + request.idOperation
                : ''
            }`
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
      HTTP.get(config.apiEndpoints.scratchcardUri.concat(id)).then(
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
      HTTP.post(config.apiEndpoints.scratchcardUri, model).then(
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
  update: model => {
    return new Promise((resolve, reject) => {
      HTTP.put(config.apiEndpoints.scratchcardUri, model).then(
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
  delete: id => {
    return new Promise((resolve, reject) => {
      HTTP.delete(config.apiEndpoints.scratchcardUri.concat(id)).then(
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
  uploadImage: file => {
    return new Promise((resolve, reject) => {
      var formData = new FormData();
      formData.append('file', file);
      axios
        .post(
          config.apiEndpoints.scratchcardUri.concat('UploadImage'),
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        .then(
          response => {
            resolve(response);
          },
          error => {
            reject(error);
          }
        );
    });
  },
  generate: id => {
    return new Promise((resolve, reject) => {
      HTTP.post(
        config.apiEndpoints.scratchcardUri.concat(id + '/Generate')
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
  billets: id => {
    return new Promise((resolve, reject) => {
      HTTP.get(config.apiEndpoints.scratchcardUri.concat(id + '/Billets')).then(
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
  operations: () => {
    return new Promise((resolve, reject) => {
      HTTP.get(config.apiEndpoints.scratchcardUri.concat('Operations')).then(
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
  prizeBillets: id => {
    return new Promise((resolve, reject) => {
      HTTP.get(
        config.apiEndpoints.scratchcardUri.concat(id + '/PrizeBillets')
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
