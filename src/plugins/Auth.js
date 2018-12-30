/* eslint-disable no-undef */
function install(Vue) {
  Vue.prototype.$auth = {
    constructor() {
      _user = this.getUser();
    },
    get currentUser() {
      if (this._user) {
        return this._user;
      }
      this._user = this.getUser();
      return this._user;
    },
    getUser() {
      let storageString = localStorage.getItem(this._userStoreKey);
      if (storageString) {
        const usr = JSON.parse(storageString);
        return usr;
      }
      return null;
    },
    get _userStoreKey() {
      return 'portal.user';
    },
    isAuthenticated() {
      return !!localStorage.getItem(this._userStoreKey);
    },
    authRedirectGuard() {
      const self = this;
      return async (to, from, next) => {
        const requiresAuth = to.matched.some(
          record => record.meta.requiresAuth
        );
        if (requiresAuth) {
          if (self.currentUser) {
            next();
          } else {
            next({
              path: '/access-denied'
            });
          }
        } else {
          next();
        }
      };
    }
  };
}

export default { install };
