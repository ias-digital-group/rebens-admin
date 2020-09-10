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
            idScratchcard: null,
            idOperation: null
          };
      HTTP.get(
        config.apiEndpoints.scratchcardPrizeUri.concat(
          `?page=${request.page}&pageItems=${request.pageItems}&searchWord=${
            request.searchWord
          }&idScratchcard=${
            request.idScratchcard != null &&
            request.idScratchcard != undefined &&
            request.idScratchcard != 0
              ? '&idScratchcard=' + request.idScratchcard
              : ''
          }${
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
      HTTP.get(
        config.apiEndpoints.scratchcardPrizeUri.concat(`read/${id}`)
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
  create: model => {
    return new Promise((resolve, reject) => {
      HTTP.post(config.apiEndpoints.scratchcardPrizeUri, model).then(
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
      HTTP.put(config.apiEndpoints.scratchcardPrizeUri, model).then(
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
      HTTP.delete(config.apiEndpoints.scratchcardPrizeUri.concat(id)).then(
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
