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
            active: '',
            type: '',
            idOperation: ''
          };
      HTTP.get(
        config.apiEndpoints.benefitUri.concat(
          `?page=${request.page}&pageItems=${request.pageItems}&searchWord=${request.searchWord}&sort=${request.sort}&active=${request.active}&type=${request.type}&idOperation=${request.idOperation}`
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
  getCategories: id => {
    return new Promise((resolve, reject) => {
      HTTP.get(config.apiEndpoints.benefitUri.concat(`${id}/category`)).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  saveCategories: function(id, categoryIds) {
    return new Promise((resolve, reject) => {
      HTTP.post(config.apiEndpoints.benefitUri.concat('SaveCategories'), {
        CategoryIds: categoryIds,
        idBenefit: id
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
  addcategory: function(id, categoryId) {
    return new Promise((resolve, reject) => {
      HTTP.post(config.apiEndpoints.benefitUri.concat('addcategory'), {
        idCategory: categoryId,
        idBenefit: id
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
  deleteCategory: function(id, categoryId) {
    return new Promise((resolve, reject) => {
      HTTP.delete(
        config.apiEndpoints.benefitUri.concat(`${id}/category/${categoryId}`)
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
      HTTP.get(config.apiEndpoints.benefitUri.concat(id)).then(
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
      HTTP.post(config.apiEndpoints.benefitUri, model).then(
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
      HTTP.put(config.apiEndpoints.benefitUri, model).then(
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
      HTTP.delete(config.apiEndpoints.benefitUri.concat(id)).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  findAllActive: () => {
    return new Promise((resolve, reject) => {
      HTTP.get(config.apiEndpoints.benefitUri.concat('active')).then(
        response => {
          console.log('findAllActive.response', response);
          resolve(response.data);
        },
        error => {
          console.log('findAllActive.error', error);
          reject(error);
        }
      );
    });
  },
  toggleActive: function(id) {
    return new Promise((resolve, reject) => {
      HTTP.post(
        config.apiEndpoints.benefitUri.concat(`toggleActive/${id}`)
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
  duplicate: function(id) {
    return new Promise((resolve, reject) => {
      HTTP.post(config.apiEndpoints.benefitUri.concat(`duplicate/${id}`)).then(
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
