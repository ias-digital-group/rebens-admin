import { HTTP } from '../../http';
import _ from 'lodash';
import config from '../../config';

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
      if (request.active == null) request.active = '';
      HTTP.get(
        config.apiEndpoints.operationUri.concat(
          `?page=${request.page}&pageItems=${request.pageItems}&searchWord=${
            request.searchWord
          }&sort=${request.sort}&active=${
            request.active != null && request.active != undefined
              ? request.active
              : ''
          }`
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
    if (!id) id = 0;
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
  saveConfiguration: function(id, data, modules, wirecard) {
    const postData = { fields: data.fields, wirecard, modules };
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
  listModules: function(id) {
    if (!id) id = 0;
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
  },
  listByModule: function(module) {
    return new Promise((resolve, reject) => {
      HTTP.get(
        config.apiEndpoints.operationUri.concat(`ListByModule/${module}`)
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
  toggleActive: id => {
    return new Promise((resolve, reject) => {
      HTTP.post(
        config.apiEndpoints.operationUri.concat(`${id}/ToggleActive`)
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
