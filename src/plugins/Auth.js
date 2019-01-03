/* eslint-disable no-undef */
import router from '../routes/router';
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
    saveUser(signinResponse) {
      const user = {
        accessToken: signinResponse.extra.token.accessToken,
        name: signinResponse.extra.user.name,
        email: signinResponse.extra.user.email,
        id: signinResponse.extra.user.id
      };
      localStorage.setItem(this._userStoreKey, JSON.stringify(user));
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
    get isAuthenticated() {
      return localStorage.getItem(this._userStoreKey);
    },
    signin() {
      this.signout();
      router.push('/login');
    },
    signout() {
      localStorage.clear();
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
              path: '/login'
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
