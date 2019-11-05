import { HTTP } from '../../http';
import config from '../../config';

export default {
  loadDashboard: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : { page: 0, pageItems: 30, searchWord: '', sort: 'name ASC' };
      HTTP.get(config.apiEndpoints.reportUri.concat('LoadDashboard')).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  listCustomers: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : {
            page: 0,
            pageItems: 30,
            searchWord: '',
            sort: 'name ASC',
            idOperation: '',
            status: 0
          };
      HTTP.get(
        config.apiEndpoints.reportUri.concat(
          `ListCustomers?page=${request.page}&pageItems=${request.pageItems}&searchWord=${request.searchWord}&sort=${request.sort}&idOperation=${request.idOperation}&status=${request.status}`
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
  listBenefitUse: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : {
            page: 0,
            pageItems: 30,
            searchWord: '',
            sort: 'name ASC',
            idOperation: '',
            startDate: '',
            endDate: ''
          };
      HTTP.get(
        config.apiEndpoints.reportUri.concat(
          `ListBenefitUse?page=${request.page}&pageItems=${request.pageItems}&searchWord=${request.searchWord}&sort=${request.sort}&idOperation=${request.idOperation}&startDate=${request.startDate}&endDate=${request.endDate}`
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
  }
};
