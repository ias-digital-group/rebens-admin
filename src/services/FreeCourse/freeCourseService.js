import config from '../../config';
import { HTTP } from '../../http';

export default {
  findAll: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : { page: 0, pageItems: 30, searchWord: '', sort: 'name ASC' };
      HTTP.get(
        config.apiEndpoints.freeCourseUri.concat(
          `?page=${request.page}&pageItems=${request.pageItems}&searchWord=${
            request.searchWord
          }&sort=${request.sort}${
            request.idOperation ? '&idOperation=' + request.idOperation : ''
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
      HTTP.get(config.apiEndpoints.freeCourseUri.concat(id)).then(
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
      HTTP.post(config.apiEndpoints.freeCourseUri, model).then(
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
      HTTP.put(config.apiEndpoints.freeCourseUri, model).then(
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
      HTTP.delete(config.apiEndpoints.freeCourseUri.concat(id)).then(
        response => {
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
      HTTP.get(config.apiEndpoints.freeCourseUri.concat(`${id}/category`)).then(
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
      HTTP.post(config.apiEndpoints.freeCourseUri.concat('SaveCategories'), {
        CategoryIds: categoryIds,
        idFreeCourse: id
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
      HTTP.post(config.apiEndpoints.freeCourseUri.concat('addcategory'), {
        idCategory: categoryId,
        idFreeCourse: id
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
        config.apiEndpoints.freeCourseUri.concat(`${id}/category/${categoryId}`)
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
