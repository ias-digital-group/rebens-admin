import { HTTP } from '../../http';
import config from '../../config';

export default {
  findAll: request => {
    return new Promise((resolve, reject) => {
      request = request
        ? request
        : { page: 0, pageItems: 30, searchWord: '', sort: 'name ASC' };
      HTTP.get(
        config.apiEndpoints.addressUri.concat(
          `?page=${request.page}&pageItems=${request.pageItems}&searchWord=${
            request.searchWord
          }&sort=${request.sort}`
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
      case 'benefits':
        ret = this.findAllByBenefit(request);
        break;
      case 'colleges':
        ret = this.findAllByCollege(request);
        break;
      case 'courses':
        ret = this.findAllByCourse(request);
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
          `${request.parentId}/address?page=${request.page}&pageItems=${
            request.pageItems
          }&searchWord=${request.searchWord}&sort=${request.sort}`
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
  findAllByBenefit: function(request) {
    return new Promise((resolve, reject) => {
      if (!request || request.parentId == 0) {
        reject(new Error('Objeto request invalido'));
      }
      HTTP.get(
        config.apiEndpoints.benefitUri.concat(
          `${request.parentId}/address?page=${request.page}&pageItems=${
            request.pageItems
          }&searchWord=${request.searchWord}&sort=${request.sort}`
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
  findAllByCollege: function(request) {
    return new Promise((resolve, reject) => {
      if (!request || request.parentId == 0) {
        reject(new Error('Objeto request invalido'));
      }
      HTTP.get(
        config.apiEndpoints.courseCollegeUri.concat(
          `${request.parentId}/address?page=${request.page}&pageItems=${
            request.pageItems
          }&searchWord=${request.searchWord}&sort=${request.sort}`
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
  findAllByCourse: function(request) {
    return new Promise((resolve, reject) => {
      if (!request || request.parentId == 0) {
        reject(new Error('Objeto request invalido'));
      }
      HTTP.get(
        config.apiEndpoints.courseUri.concat(
          `${request.parentId}/address?page=${request.page}&pageItems=${
            request.pageItems
          }&searchWord=${request.searchWord}&sort=${request.sort}`
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
      HTTP.get(config.apiEndpoints.addressUri.concat(id)).then(
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
      HTTP.post(config.apiEndpoints.addressUri, model).then(
        response => {
          resolve(response.data);
        },
        error => {
          reject(error);
        }
      );
    });
  },
  assiciateAddress: function(request) {
    let ret;
    switch (request.parent) {
      case 'partners':
        ret = this.associatePartner(request.id, request.parentId);
        break;
      case 'benefits':
        ret = this.associateBenefit(request.id, request.parentId);
        break;
      case 'colleges':
        ret = this.associateCollege(request.id, request.parentId);
        break;
      case 'courses':
          ret = this.associateCourse(request.id, request.parentId);
          break;
      default:
        ret = null;
        break;
    }
    return ret;
  },
  unlinkAddress: function(request) {
    let ret;
    switch (request.parent) {
      case 'partners':
        ret = this.deletePartner(request.id, request.parentId);
        break;
      case 'benefits':
        ret = this.deleteBenefit(request.id, request.parentId);
        break;
      case 'colleges':
        ret = this.deleteCollege(request.id, request.parentId);
        break;
      case 'courses':
        ret = this.deleteCourse(request.id, request.parentId);
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
        config.apiEndpoints.partnerUri.concat(`${partnerId}/address/${id}`)
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
  deleteBenefit: function(id, benefitId) {
    return new Promise((resolve, reject) => {
      HTTP.delete(
        config.apiEndpoints.benefitUri.concat(`${benefitId}/address/${id}`)
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
  deleteCollege: function(id, collegeId) {
    return new Promise((resolve, reject) => {
      HTTP.delete(
        config.apiEndpoints.courseCollegeUri.concat(`${collegeId}/address/${id}`)
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
  deleteCourse: function(id, courseId) {
    return new Promise((resolve, reject) => {
      HTTP.delete(
        config.apiEndpoints.courseUri.concat(`${courseId}/address/${id}`)
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
      HTTP.post(config.apiEndpoints.partnerUri.concat('addaddress'), {
        idPartner: partnerId,
        idAddress: id
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
  associateBenefit: function(id, benefitId) {
    return new Promise((resolve, reject) => {
      HTTP.post(config.apiEndpoints.benefitUri.concat('addaddress'), {
        idBenefit: benefitId,
        idAddress: id
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
  associateCollege: function(id, collegeId) {
    return new Promise((resolve, reject) => {
      HTTP.post(config.apiEndpoints.courseCollegeUri.concat('addaddress'), {
        idCourseCollege: collegeId,
        idAddress: id
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
  associateCourse: function(id, courseId) {
    return new Promise((resolve, reject) => {
      HTTP.post(
        config.apiEndpoints.courseUri.concat(`${courseId}/address/${id}`)
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
  update: model => {
    return new Promise((resolve, reject) => {
      HTTP.put(config.apiEndpoints.addressUri, model).then(
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
      HTTP.delete(config.apiEndpoints.addressUri.concat(id)).then(
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
