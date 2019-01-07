/* eslint-disable no-undef */
import router from '../routes/router';
function install(Vue) {
  Vue.prototype.$auth = {
    constructor() {
      _user = null;
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
        accessToken: signinResponse.token.accessToken,
        name: signinResponse.user.name,
        email: signinResponse.user.email,
        id: signinResponse.user.id,
        role: signinResponse.role
      };
      this.clearStorage();
      console.log(user.accessToken);
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
      router.push('/login');
    },
    clearStorage() {
      localStorage.clear();
    },
    signout() {
      this.clearStorage();
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
