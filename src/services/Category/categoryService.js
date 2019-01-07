import { HTTP } from '../../http';
const categoryUrl = process.env.VUE_APP_API_URI.concat('category/');
export default {
  findAll: request => {
    return new Promise((resolve, reject) => {
      request = request ? request : { page: 0, pageItems: 30, searchWord: '' };
      HTTP.get(
        categoryUrl.concat(
          `?page=${request.page}&pageItems=${request.pageItems}&searchWord=${request.searchWord}`
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
  getListTree: () => {
    return new Promise((resolve, reject) => {
      HTTP.get(categoryUrl.concat('ListTree')).then(
        response => {
          resolve(response);
        },
        error => {
          reject(error);
        }
      );
    });
  }
};
