import { HTTP } from '../../http';
import _ from 'lodash';
import config from '../../config';
import axios from 'axios';

export default {
  findAll: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : {
            page: 0,
            pageItems: 30,
            searchWord: '',
            sort: 'name ASC',
            active: ''
          };
      HTTP.get(
        config.apiEndpoints.operationUri.concat(
          `?page=${request.page}&pageItems=${request.pageItems}&searchWord=${request.searchWord}&sort=${request.sort}&active=${request.active}`
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
      HTTP.get(config.apiEndpoints.operationUri.concat(id)).then(
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
      HTTP.post(config.apiEndpoints.operationUri, model).then(
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
      HTTP.put(config.apiEndpoints.operationUri, model).then(
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
      HTTP.delete(config.apiEndpoints.operationUri.concat(id)).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  findAllByAssociation: function(request) {
    let ret;
    switch (request.parent) {
      case 'banners':
        ret = this.findAllBybanner(request.parentId);
        break;
      case 'benefits':
        ret = this.findAllByBenefit(request.parentId);
        break;
      default:
        ret = null;
        break;
    }
    return ret;
  },
  findAllBybanner: function(id) {
    return new Promise((resolve, reject) => {
      HTTP.get(config.apiEndpoints.bannerUri.concat(`${id}/operations`)).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  findAllByBenefit: function(id) {
    return new Promise((resolve, reject) => {
      HTTP.get(config.apiEndpoints.benefitUri.concat(`${id}/operations`)).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  associateOperation: function(request) {
    let ret;
    switch (request.parent) {
      case 'banners':
        ret = this.associateBanner(request.id, request.parentId);
        break;
      case 'benefits':
        ret = this.associateBenefit(
          request.id,
          request.parentId,
          request.positionId
        );
        break;
      default:
        ret = null;
        break;
    }
    return ret;
  },
  unlinkAssociation: function(request) {
    let ret;
    switch (request.parent) {
      case 'banners':
        ret = this.deleteBanner(request.id, request.parentId);
        break;
      case 'benefits':
        ret = this.deleteBenefit(request.id, request.parentId);
        break;
      default:
        ret = null;
        break;
    }
    return ret;
  },
  associateBanner: function(id, bannerId) {
    return new Promise((resolve, reject) => {
      HTTP.post(config.apiEndpoints.bannerUri.concat('addoperation'), {
        idBanner: bannerId,
        idOperation: id
      }).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  deleteBanner: function(id, bannerId) {
    return new Promise((resolve, reject) => {
      HTTP.delete(
        config.apiEndpoints.bannerUri.concat(`${bannerId}/operation/${id}`)
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
  associateBenefit: function(id, benefitId, positionId) {
    return new Promise((resolve, reject) => {
      HTTP.post(config.apiEndpoints.benefitUri.concat('addoperation'), {
        idBenefit: benefitId,
        idOperation: id,
        idPosition: positionId
      }).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  deleteBenefit: function(id, benefitId) {
    return new Promise((resolve, reject) => {
      HTTP.delete(
        config.apiEndpoints.benefitUri.concat(`${benefitId}/operation/${id}`)
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
  getConfiguration: function(id) {
    return new Promise((resolve, reject) => {
      HTTP.get(
        config.apiEndpoints.operationUri.concat(`${id}/Configuration`)
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
  saveConfiguration: function(id, data, modules) {
    const postData = { fields: data.fields, modules: modules };
    return new Promise((resolve, reject) => {
      HTTP.post(
        config.apiEndpoints.operationUri.concat(`${id}/Configuration`),
        postData
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
  findAllCustomers: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : {
            page: 0,
            pageItems: 30,
            searchWord: '',
            sort: 'name ASC',
            active: ''
          };
      HTTP.get(
        config.apiEndpoints.operationUri.concat(
          `${request.parentId}/Customers?page=${request.page}&pageItems=${request.pageItems}&searchWord=${request.searchWord}&sort=${request.sort}`
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
  createCustomer: function(id, model) {
    return new Promise((resolve, reject) => {
      HTTP.post(
        config.apiEndpoints.operationUri.concat(`${id}/customers`),
        model
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
  deleteCustomer: function(id, idCustomer) {
    return new Promise((resolve, reject) => {
      HTTP.delete(
        config.apiEndpoints.operationUri.concat(`${id}/customers/${idCustomer}`)
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
  uploadCustomerList: function(id, file) {
    return new Promise((resolve, reject) => {
      var formData = new FormData();
      formData.append('file', file);
      axios
        .post(
          config.apiEndpoints.operationUri.concat(`${id}/UploadCustomersList`),
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )
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
  publish: function(id) {
    return new Promise((resolve, reject) => {
      HTTP.post(config.apiEndpoints.operationUri.concat(`${id}/Publish`)).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  checkFileProcessing: function(id) {
    return new Promise((resolve, reject) => {
      HTTP.get(
        config.apiEndpoints.operationUri.concat(`${id}/HasFileProcessing`)
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
  listModules: function(id) {
    return new Promise((resolve, reject) => {
      HTTP.get(config.apiEndpoints.operationUri.concat(`Modules/${id}`)).then(
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
