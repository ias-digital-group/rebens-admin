import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import Auth from '../plugins/Auth';
Vue.use(Auth);
Vue.use(VueRouter);

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'active'
});

router.beforeEach(Vue.prototype.$auth.authRedirectGuard());

export default router;
