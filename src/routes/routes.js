import DashboardLayout from 'src/pages/Layout/DashboardLayout.vue';
import AuthLayout from 'src/pages/Layout/AuthLayout.vue';
// GeneralViews
import NotFound from 'src/pages/GeneralViews/NotFoundPage.vue';
import AccessDenied from 'src/pages/GeneralViews/AccessDenied.vue';
import i18n from '../i18n';

// Dashboard pages
const Dashboard = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Dashboard/Dashboard.vue');

const Login = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Login/Login.vue');

const categoriesList = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Categories/List.vue');

let categoriesPages = {
  path: '/categories',
  component: DashboardLayout,
  meta: {
    requiresAuth: true
  },
  children: [
    {
      path: '',
      name: i18n.t('pages.categories.title'),
      component: categoriesList,
      meta: {
        requiresAuth: true
      }
    }
  ]
};

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    name: 'Home',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/dashboard',
    name: 'Dashboard layout',
    children: [
      {
        path: 'dashboard',
        name: i18n.t('pages.dashboard.title'),
        components: { default: Dashboard },
        meta: {
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/',
    component: AuthLayout,
    name: 'Authentication',
    meta: {
      requiresAuth: false
    },
    children: [
      {
        path: '/login',
        name: i18n.t('pages.login.title'),
        component: Login,
        meta: {
          requiresAuth: false
        }
      }
    ]
  },
  {
    path: '*',
    component: NotFound,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/access-denied',
    component: AccessDenied,
    name: i18n.t('pages.access-denied.title'),
    meta: {
      requiresAuth: false
    }
  },
  categoriesPages
];

export default routes;
