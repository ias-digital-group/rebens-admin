import { HTTP } from '../../http';
import config from '../../config';

export default {
  list: request => {
    request = request
      ? request
      : {
          page: 0,
          pageItems: 30,
          searchWord: '',
          idOperation: 0,
          idScratchcard: 0
        };
    return new Promise((resolve, reject) => {
      HTTP.get(
        config.apiEndpoints.scratchcardDrawUri.concat(
          `?page=${request.page}&pageItems=${request.pageItems}&searchWord=${
            request.searchWord
          }${
            request.idOperation != null &&
            request.idOperation != undefined &&
            request.idOperation != 0
              ? '&idOperation=' + request.idOperation
              : ''
          }${
            request.idScratchcard != null &&
            request.idScratchcard != undefined &&
            request.idScratchcard != 0
              ? '&idScratchcard=' + request.idScratchcard
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
  listPrized: request => {
    request = request
      ? request
      : {
          page: 0,
          pageItems: 30,
          searchWord: '',
          idOperation: 0,
          idScratchcard: 0
        };
    return new Promise((resolve, reject) => {
      HTTP.get(
        config.apiEndpoints.scratchcardDrawUri.concat(
          `PrizedListPage?page=${request.page}&pageItems=${
            request.pageItems
          }&searchWord=${request.searchWord}${
            request.idOperation != null &&
            request.idOperation != undefined &&
            request.idOperation != 0
              ? '&idOperation=' + request.idOperation
              : ''
          }${
            request.idScratchcard != null &&
            request.idScratchcard != undefined &&
            request.idScratchcard != 0
              ? '&idScratchcard=' + request.idScratchcard
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
  }
};
