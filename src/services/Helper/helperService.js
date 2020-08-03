import config from '../../config';
import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';

// Create `axios-cache-adapter` instance
const cache = setupCache({
  maxAge: 15 * 60 * 1000
});

// Create `axios` instance passing the newly created `cache.adapter`
const cachedHttp = axios.create({
  adapter: cache.adapter,
  headers: {
    Accept: 'application/json'
  }
});

export default {
  findAllBenefitsTypes: () => {
    return new Promise((resolve, reject) => {
      cachedHttp
        .get(config.apiEndpoints.helperUri.concat('listBenefitType'))
        .then(
          response => {
            resolve(response.data);
          },
          error => {
            reject(error);
          }
        );
    });
  },
  findAllOperationTypes: () => {
    return new Promise((resolve, reject) => {
      cachedHttp
        .get(config.apiEndpoints.helperUri.concat('listOperationType'))
        .then(
          response => {
            resolve(response.data);
          },
          error => {
            reject(error);
          }
        );
    });
  },
  findAllIntegrationTypes: () => {
    return new Promise((resolve, reject) => {
      cachedHttp
        .get(config.apiEndpoints.helperUri.concat('listIntegrationType'))
        .then(
          response => {
            resolve(response.data);
          },
          error => {
            reject(error);
          }
        );
    });
  },
  findAllBannerTypes: () => {
    return new Promise((resolve, reject) => {
      cachedHttp
        .get(config.apiEndpoints.helperUri.concat('listBannerType'))
        .then(
          response => {
            resolve(response.data);
          },
          error => {
            reject(error);
          }
        );
    });
  },
  uploadImage: file => {
    return new Promise((resolve, reject) => {
      var formData = new FormData();
      formData.append('file', file);
      axios
        .post(config.apiEndpoints.helperUri.concat('uploadImage'), formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
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
  uploadFile: (file, type) => {
    return new Promise((resolve, reject) => {
      var formData = new FormData();
      formData.append('file', file);
      axios
        .post(
          config.apiEndpoints.helperUri.concat(`uploadFile/${type}`),
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
  getNumbers: function(s) {
    const r = s.match(/\d+/g);
    if (r && r.length > 0) {
      return r[0];
    }
    return null;
  },
  getAddressFromZipCode: function(zipCode) {
    const n = this.getNumbers(zipCode);
    return new Promise((resolve, reject) => {
      if (n == null) {
        reject({ message: 'zipCode is invalid' });
      }
      const auth = axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['Authorization'];
      cachedHttp.get(config.apiEndpoints.viaCepUri.concat(`${n}/json`)).then(
        response => {
          axios.defaults.headers.common['Authorization'] = auth;
          resolve(response.data);
        },
        error => {
          axios.defaults.headers.common['Authorization'] = auth;
          reject(error);
        }
      );
    });
  }
};
