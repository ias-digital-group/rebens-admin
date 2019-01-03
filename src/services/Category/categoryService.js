import { HTTP } from '../../http';
const categoryUrl = process.env.VUE_APP_API_URI.concat('category/');
export default {
  findAll: request => {
    return new Promise((resolve, reject) => {
      request = request ? request : { page: 1, pageItems: 30 };
      HTTP.get(
        categoryUrl.concat(
          `?page=${request.page}&pageItems=${request.pageItems}`
        )
      ).then(
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
