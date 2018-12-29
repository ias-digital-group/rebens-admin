import DashboardLayout from 'src/pages/Layout/DashboardLayout.vue';
import AuthLayout from 'src/pages/Layout/AuthLayout.vue';
// GeneralViews
import NotFound from 'src/pages/GeneralViews/NotFoundPage.vue';
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
  name: i18n.t('pages.categories.title'),
  children: [
    {
      path: '',
      name: i18n.t('pages.categories.title'),
      component: categoriesList
    }
  ]
};

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    name: 'Home'
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
        components: { default: Dashboard }
      }
    ]
  },
  {
    path: '/',
    component: AuthLayout,
    name: 'Authentication',
    children: [
      {
        path: '/login',
        name: 'Login',
        component: Login
      }
    ]
  },
  { path: '*', component: NotFound },
  categoriesPages
];

export default routes;
