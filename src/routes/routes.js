import DashboardLayout from 'src/pages/Layout/DashboardLayout.vue';
import AuthLayout from 'src/pages/Layout/AuthLayout.vue';
// GeneralViews
import NotFound from 'src/pages/GeneralViews/NotFoundPage.vue';
import AccessDenied from 'src/pages/GeneralViews/AccessDenied.vue';
import i18n from '../i18n';

// Dashboard pages
const Dashboard = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Dashboard/Dashboard.vue');

// const Content = () =>
//   import(/* webpackChunkName: "dashboard" */ 'src/pages/Layout/Content.vue');

const Login = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Login/Login.vue');

const CategoriesList = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Categories/List.vue');

const CategoriesEdit = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Categories/Edit.vue');

const PartnersList = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Partners/List.vue');

const PartnersEdit = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Partners/Edit.vue');

const OperationsList = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Operations/List.vue');

const OperationsEdit = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Operations/Edit.vue');

const BenefitsList = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Benefits/List.vue');

const BenefitsEdit = () =>
  import(/* webpackChunkName: "dashboard" */ 'src/pages/Benefits/Edit.vue');

const BannersList = () => import('src/pages/Banners/List.vue');
const BannersEdit = () => import('src/pages/Banners/Edit.vue');

const FaqsList = () => import('src/pages/Faq/List.vue');
const FaqsEdit = () => import('src/pages/Faq/Edit.vue');

const UsersList = () => import('src/pages/User/List.vue');
const UsersEdit = () => import('src/pages/User/Edit.vue');

let categoriesPages = {
  path: '/categories',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: ['master', 'publisher'],
    title: i18n.t('pages.categories.title')
  },
  children: [
    {
      path: '',
      name: 'category',
      component: CategoriesList,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisher'],
        title: i18n.t('pages.categories.title')
      }
    },
    {
      path: 'new',
      name: `new_category`,
      component: CategoriesEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisher'],
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
        roles: ['master', 'publisher'],
        title: i18n.t('pages.categories.title')
      }
    }
  ]
};

let partnersPages = {
  path: '/partners',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: ['master', 'publisher'],
    title: i18n.t('pages.partners.title')
  },
  children: [
    {
      path: '',
      name: 'partner',
      component: PartnersList,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisher'],
        title: i18n.t('pages.partners.title')
      }
    },
    {
      path: 'new',
      name: `new_partner`,
      component: PartnersEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisher'],
        title: i18n.t('pages.partners.title')
      }
    },
    {
      path: ':id/edit',
      name: 'edit_partner',
      props: true,
      component: PartnersEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisher'],
        title: i18n.t('pages.partners.title')
      }
    }
  ]
};

let operationsPages = {
  path: '/operations',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: ['master'],
    title: i18n.t('pages.operations.title')
  },
  children: [
    {
      path: '',
      name: 'operation',
      component: OperationsList,
      meta: {
        requiresAuth: true,
        roles: ['master'],
        title: i18n.t('pages.operations.title')
      }
    },
    {
      path: 'new',
      name: `new_operation`,
      component: OperationsEdit,
      meta: {
        requiresAuth: true,
        roles: ['master'],
        title: i18n.t('pages.operations.title')
      }
    },
    {
      path: ':id/edit',
      name: 'edit_operation',
      props: true,
      component: OperationsEdit,
      meta: {
        requiresAuth: true,
        roles: ['master'],
        title: i18n.t('pages.operations.title')
      }
    }
  ]
};

let bannersPages = {
  path: '/banners',
  component: DashboardLayout,
  meta:{
    requiresAuth: true,
    roles: ['master', 'administrator', 'publisher'],
    title: i18n.t('pages.banners.title')
  },
  children:[
    {
      path: '',
      name:'banner',
      component: BannersList,
      meta:{
        requiresAuth: true,
        roles: ['master', 'administrator', 'publisher'],
        title: i18n.t('pages.banners.title')
      }
    },
    {
      path: 'new',
      name: `new_banner`,
      component: BannersEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'administrator', 'publisher'],
        title: i18n.t('pages.banners.title')
      }
    },
    {
      path: ':id/edit',
      name: 'edit_banner',
      props: true,
      component: BannersEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'administrator', 'publisher'],
        title: i18n.t('pages.banners.title')
      }
    }
  ]
}

let benefitsPages = {
  path: '/benefits',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: ['master', 'publisher'],
    title: i18n.t('pages.benefits.title')
  },
  children: [
    {
      path: '',
      name: 'benefit',
      component: BenefitsList,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisher'],
        title: i18n.t('pages.benefits.title')
      }
    },
    {
      path: 'new',
      name: `new_benefit`,
      component: BenefitsEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisher'],
        title: i18n.t('pages.benefits.title')
      }
    },
    {
      path: ':id/edit',
      name: 'edit_benefit',
      props: true,
      component: BenefitsEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisher'],
        title: i18n.t('pages.benefits.title')
      }
    }
  ]
};

let faqsPages = {
  path: '/faqs',
  component: DashboardLayout,
  meta:{
    requiresAuth: true,
    roles: ['master', 'administrator', 'publisher'],
    title: i18n.t('pages.faqs.title')
  },
  children:[
    {
      path: '',
      name:'faq',
      component: FaqsList,
      meta:{
        requiresAuth: true,
        roles: ['master', 'administrator', 'publisher'],
        title: i18n.t('pages.faqs.title')
      }
    },
    {
      path: 'new',
      name: `new_faq`,
      component: FaqsEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'administrator', 'publisher'],
        title: i18n.t('pages.faqs.title')
      }
    },
    {
      path: ':id/edit',
      name: 'edit_faq',
      props: true,
      component: FaqsEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'administrator', 'publisher'],
        title: i18n.t('pages.faqs.title')
      }
    }
  ]
}

let usersPages = {
  path: '/users',
  component: DashboardLayout,
  meta:{
    requiresAuth: true,
    roles: ['master'],
    title: i18n.t('pages.users.title')
  },
  children:[
    {
      path: '',
      name:'user',
      component: UsersList,
      meta:{
        requiresAuth: true,
        roles: ['master'],
        title: i18n.t('pages.users.title')
      }
    },
    {
      path: 'new',
      name: `new_user`,
      component: FaqsEdit,
      meta: {
        requiresAuth: true,
        roles: ['master'],
        title: i18n.t('pages.users.title')
      }
    },
    {
      path: ':id/edit',
      name: 'edit_user',
      props: true,
      component: UsersEdit,
      meta: {
        requiresAuth:true,
        roles: ['master'],
        title: i18n.t('pages.users.title')
      }
    }
  ]
}

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
        components: { default: Dashboard },
        meta: {
          requiresAuth: true,
          roles: ['master', 'administrator', 'publisher'],
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
  categoriesPages,
  bannersPages,
  partnersPages,
  operationsPages,
  benefitsPages,
  faqsPages,
  usersPages
];

export default routes;
