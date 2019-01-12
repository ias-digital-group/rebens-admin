import DashboardLayout from 'src/pages/Layout/DashboardLayout.vue';
import AuthLayout from 'src/pages/Layout/AuthLayout.vue';
// GeneralViews
import NotFound from 'src/pages/GeneralViews/NotFoundPage.vue';
import AccessDenied from 'src/pages/GeneralViews/AccessDenied.vue';
import i18n from '../i18n';

// Dashboard pages
// const Dashboard = () =>
//   import(/* webpackChunkName: "dashboard" */ 'src/pages/Dashboard/Dashboard.vue');

const Content = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Layout/Content.vue');

const Login = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Login/Login.vue');

const CategoriesList = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Categories/List.vue');

const CategoriesEdit = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Categories/Edit.vue');

let categoriesPages = {
  path: '/categories',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    title: i18n.t('pages.categories.title')
  },
  children: [
    {
      path: '',
      name: 'category',
      component: CategoriesList,
      meta: {
        requiresAuth: true,
        title: i18n.t('pages.categories.title')
      }
    },
    {
      path: 'new',
      name: `new_category`,
      component: CategoriesEdit,
      meta: {
        requiresAuth: true,
        title: i18n.t('pages.categories.title')
      }
    },
    {
      path: ':id/edit',
      name: 'edit_category',
      props: true,
      component: CategoriesEdit,
      meta: {
        requiresAuth: true,
        title: i18n.t('pages.categories.title')
      }
    }
  ]
};

const routes = [
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/dashboard',
    name: 'Dashboard layout',
    children: [
      {
        path: '/dashboard',
        name: i18n.t('pages.dashboard.title'),
        components: { default: Content },
        meta: {
          requiresAuth: true,
          title: i18n.t('pages.dashboard.title')
        }
      }
    ]
  },
  {
    path: '/',
    component: AuthLayout,
    name: 'Authentication',
    meta: {
      requiresAuth: false,
      title: i18n.t('pages.login.title')
    },
    children: [
      {
        path: '/login',
        name: i18n.t('pages.login.title'),
        component: Login,
        meta: {
          requiresAuth: false,
          title: i18n.t('pages.login.title')
        }
      }
    ]
  },
  {
    path: '*',
    component: NotFound,
    meta: {
      requiresAuth: false,
      title: 'Not Found'
    }
  },
  {
    path: '/access-denied',
    component: AccessDenied,
    name: i18n.t('pages.access-denied.title'),
    meta: {
      requiresAuth: false,
      title: i18n.t('pages.access-denied.title')
    }
  },
  categoriesPages
];

export default routes;
