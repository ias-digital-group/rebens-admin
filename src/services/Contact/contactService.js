import { HTTP } from '../../http';
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
            type: '',
            idItem: '',
            active: ''
          };
      HTTP.get(
        config.apiEndpoints.contactUri.concat(
          `?page=${request.page}&pageItems=${request.pageItems}&searchWord=${
            request.searchWord
          }&sort=${request.sort}&active=${
            request.active === undefined || request.active === null
              ? ''
              : request.active
          }&type=${
            request.type === undefined || request.type === null
              ? ''
              : request.type
          }&idItem=${request.idItem === null ? '' : request.idItem}`
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
  findAllbyAssociation: function(request) {
    let ret;
    switch (request.parent) {
      case 'partners':
        ret = this.findAllByPartner(request);
        break;
      default:
        ret = null;
        break;
    }
    return ret;
  },
  findAllByPartner: function(request) {
    return new Promise((resolve, reject) => {
      if (!request || request.parentId == 0) {
        reject(new Error('Objeto request invalido'));
      }
      HTTP.get(
        config.apiEndpoints.partnerUri.concat(
          `${request.parentId}/contacts?page=${request.page}&pageItems=${request.pageItems}&searchWord=${request.searchWord}&sort=${request.sort}`
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
      HTTP.get(config.apiEndpoints.contactUri.concat(id)).then(
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
      HTTP.post(config.apiEndpoints.contactUri, model).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  assiciateContact: function(request) {
    let ret;
    switch (request.parent) {
      case 'partners':
        ret = this.associatePartner(request.id, request.parentId);
        break;
      default:
        ret = null;
        break;
    }
    return ret;
  },
  unlinkContact: function(request) {
    let ret;
    switch (request.parent) {
      case 'partners':
        ret = this.deletePartner(request.id, request.parentId);
        break;
      default:
        ret = null;
        break;
    }
    return ret;
  },
  deletePartner: function(id, partnerId) {
    return new Promise((resolve, reject) => {
      HTTP.delete(
        config.apiEndpoints.partnerUri.concat(`${partnerId}/contacts/${id}`)
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
  associatePartner: function(id, partnerId) {
    return new Promise((resolve, reject) => {
      HTTP.post(config.apiEndpoints.partnerUri.concat('addcontact'), {
        idPartner: partnerId,
        idContact: id
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
  update: model => {
    return new Promise((resolve, reject) => {
      HTTP.put(config.apiEndpoints.contactUri, model).then(
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
      HTTP.delete(config.apiEndpoints.contactUri.concat(id)).then(
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
        config.apiEndpoints.contactUri.concat(`${id}/ToggleActive`)
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
