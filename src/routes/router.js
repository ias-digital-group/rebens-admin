import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import store from '../store';

Vue.use(VueRouter);

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'active'
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth) {
    if (store.getters.isAuthenticated) {
      const matchedRole = to.meta.roles.find(function(role) {
        return store.getters.currentUser.role === role;
      });
      if (matchedRole) {
        next();
      } else {
        let url = '';
        if (store.getters.currentUser.role === 'promoter') {
          url = '/promoter';
        } else if (store.getters.currentUser.role == 'partnerApprover') {
          url = '/operationPartner/approve';
        } else if (store.getters.currentUser.role == 'ticketChecker') {
          url = '/orders';
        } else if (store.getters.currentUser.role == 'couponChecker') {
          url = '/benefits/validation';
        } else {
          url = '/access-denied';
        }

        next({
          path: url
        });
      }

      //next();
    } else {
      next({
        path: '/login'
      });
    }
  } else {
    next();
  }
});

export default router;
