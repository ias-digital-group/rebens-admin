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
    console.log(store.getters.isAuthenticated);
    if (store.getters.isAuthenticated) {
      next();
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
