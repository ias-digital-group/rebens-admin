import DashboardLayout from 'src/pages/Layout/DashboardLayout.vue';
import AuthLayout from 'src/pages/Layout/AuthLayout.vue';
// GeneralViews
import NotFound from 'src/pages/GeneralViews/NotFoundPage.vue';
import AccessDenied from 'src/pages/GeneralViews/AccessDenied.vue';
import i18n from '../i18n';

// Dashboard pages
const Dashboard = () => import('src/pages/Dashboard/Dashboard.vue');

// const Content = () =>
//   import('src/pages/Layout/Content.vue');

const Login = () => import('src/pages/Login/Login.vue');
const PasswordRecovery = () => import('src/pages/Login/PasswordRecovery.vue');
const Validate = () => import('src/pages/Validate/Validate.vue');

const CategoriesList = () => import('src/pages/Categories/List.vue');
const CategoriesEdit = () => import('src/pages/Categories/Edit.vue');

const FaqsList = () => import('src/pages/Faqs/List.vue');
const FaqsEdit = () => import('src/pages/Faqs/Edit.vue');

const CustomerList = () => import('src/pages/Customers/List.vue');
const CustomerEdit = () => import('src/pages/Customers/Edit.vue');

const PagesList = () => import('src/pages/Pages/List.vue');
const PagesEdit = () => import('src/pages/Pages/Edit.vue');

const PartnersList = () => import('src/pages/Partners/List.vue');
const PartnersEdit = () => import('src/pages/Partners/Edit.vue');

const OperationsList = () => import('src/pages/Operations/List.vue');
const OperationsEdit = () => import('src/pages/Operations/Edit.vue');

const BenefitsList = () => import('src/pages/Benefits/List.vue');
const BenefitsEdit = () => import('src/pages/Benefits/Edit.vue');

const BannersList = () => import('src/pages/Banners/List.vue');
const BannersEdit = () => import('src/pages/Banners/Edit.vue');

const UsersList = () => import('src/pages/User/List.vue');
const UsersEdit = () => import('src/pages/User/Edit.vue');

const CustomerReport = () => import('src/pages/Report/Customer.vue');
const BenefitUseReport = () => import('src/pages/Report/BenefitUse.vue');

const OperationPartnerList = () => import('src/pages/OperationPartner/List.vue');
const OperationPartnerEdit = () => import('src/pages/OperationPartner/Edit.vue');

const ChangePassword = () => import('src/pages/Account/ChangePassword.vue');

let categoriesPages = {
  path: '/categories',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: ['master', 'publisher', 'administrator', 'publisherRebens', 'administratorRebens'],
    title: i18n.t('pages.categories.title')
  },
  children: [
    {
      path: '',
      name: 'category',
      component: CategoriesList,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisher', 'administrator', 'publisherRebens', 'administratorRebens'],
        title: i18n.t('pages.categories.title')
      }
    },
    {
      path: 'new',
      name: `new_category`,
      component: CategoriesEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'administrator', 'publisherRebens', 'administratorRebens'],
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
        roles: ['master', 'administrator', 'publisherRebens', 'administratorRebens'],
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
    roles: ['master', 'publisherRebens', 'administratorRebens'],
    title: i18n.t('pages.partners.title')
  },
  children: [
    {
      path: '',
      name: 'partner',
      component: PartnersList,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisherRebens', 'administratorRebens'],
        title: i18n.t('pages.partners.title')
      }
    },
    {
      path: 'new',
      name: `new_partner`,
      component: PartnersEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisherRebens', 'administratorRebens'],
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
        roles: ['master', 'publisherRebens', 'administratorRebens'],
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
    roles: ['master','administratorRebens','publisherRebens'],
    title: i18n.t('pages.operations.title')
  },
  children: [
    {
      path: '',
      name: 'operation',
      component: OperationsList,
      meta: {
        requiresAuth: true,
        roles: ['master','administratorRebens','publisherRebens'],
        title: i18n.t('pages.operations.title')
      }
    },
    {
      path: 'new',
      name: `new_operation`,
      component: OperationsEdit,
      meta: {
        requiresAuth: true,
        roles: ['master','administratorRebens','publisherRebens'],
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
        roles: ['master','administratorRebens','publisherRebens'],
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
    roles: ['master', 'administrator', 'publisher','publisherRebens', 'administratorRebens'],
    title: i18n.t('pages.banners.title')
  },
  children:[
    {
      path: '',
      name:'banner',
      component: BannersList,
      meta:{
        requiresAuth: true,
        roles: ['master', 'administrator', 'publisher','publisherRebens', 'administratorRebens'],
        title: i18n.t('pages.banners.title')
      }
    },
    {
      path: 'new',
      name: `new_banner`,
      component: BannersEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'administrator', 'publisher','publisherRebens', 'administratorRebens'],
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
        roles: ['master', 'administrator', 'publisher','publisherRebens', 'administratorRebens'],
        title: i18n.t('pages.banners.title')
      }
    }
  ]
}

let faqsPages = {
  path: '/faqs',
  component: DashboardLayout,
  meta:{
    requiresAuth: true,
    roles: ['publisher', 'administrator','master'],
    title: i18n.t('pages.faqs.title')
  },
  children:[
    {
      path: '',
      name:'faq',
      component: FaqsList,
      meta:{
        requiresAuth: true,
        roles: ['publisher', 'administrator','master'],
        title: i18n.t('pages.faqs.title')
      }
    },
    {
      path: 'new',
      name: `new_faq`,
      component: FaqsEdit,
      meta: {
        requiresAuth: true,
        roles: ['publisher', 'administrator','master'],
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
        roles: ['publisher', 'administrator','master'],
        title: i18n.t('pages.faqs.title')
      }
    }
  ]
}

let customersPages = {
  path: '/customers',
  component: DashboardLayout,
  meta:{
    requiresAuth: true,
    roles: ['publisher', 'administrator','master'],
    title: 'Pré-cadastro'
  },
  children:[
    {
      path: '',
      name:'customer',
      component: CustomerList,
      meta:{
        requiresAuth: true,
        roles: ['publisher', 'administrator','master'],
        title: 'Pré-cadastro'
      }
    },
    {
      path: 'new',
      name: `new_customer`,
      component: CustomerEdit,
      meta: {
        requiresAuth: true,
        roles: ['publisher', 'administrator','master'],
        title: 'Pré-cadastro'
      }
    }
  ]
}

let pagesPages = {
  path: '/pages',
  component: DashboardLayout,
  meta:{
    requiresAuth: true,
    roles: ['publisher', 'administrator','master'],
    title: i18n.t('pages.pages.title')
  },
  children:[
    {
      path: '',
      name:'page',
      component: PagesList,
      meta:{
        requiresAuth: true,
        roles: ['publisher', 'administrator','master'],
        title: i18n.t('pages.pages.title')
      }
    },
    {
      path: 'new',
      name: `new_page`,
      component: PagesEdit,
      meta: {
        requiresAuth: true,
        roles: ['publisher', 'administrator','master'],
        title: i18n.t('pages.pages.title')
      }
    },
    {
      path: ':id/edit',
      name: 'edit_page',
      props: true,
      component: PagesEdit,
      meta: {
        requiresAuth: true,
        roles: ['publisher', 'administrator','master'],
        title: i18n.t('pages.pages.title')
      }
    }
  ]
}

let benefitsPages = {
  path: '/benefits',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: ['master', 'administrator', 'publisher','publisherRebens', 'administratorRebens'],
    title: i18n.t('pages.benefits.title')
  },
  children: [
    {
      path: '',
      name: 'benefit',
      component: BenefitsList,
      meta: {
        requiresAuth: true,
        roles: ['master', 'administrator', 'publisher','publisherRebens', 'administratorRebens'],
        title: i18n.t('pages.benefits.title')
      }
    },
    {
      path: 'new',
      name: `new_benefit`,
      component: BenefitsEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'administrator', 'publisher','publisherRebens', 'administratorRebens'],
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
        roles: ['master', 'administrator', 'publisher','publisherRebens', 'administratorRebens'],
        title: i18n.t('pages.benefits.title')
      }
    }
  ]
};
let usersPages = {
  path: '/users',
  component: DashboardLayout,
  meta:{
    requiresAuth: true,
    roles: ['master','administrator', 'administratorRebens'],
    title: i18n.t('pages.users.title')
  },
  children:[
    {
      path: '',
      name:'user',
      component: UsersList,
      meta:{
        requiresAuth: true,
        roles: ['master','administrator', 'administratorRebens'],
        title: i18n.t('pages.users.title')
      }
    },
    {
      path: 'new',
      name: `new_user`,
      component: UsersEdit,
      meta: {
        requiresAuth: true,
        roles: ['master','administrator', 'administratorRebens'],
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
        roles: ['master','administrator', 'administratorRebens'],
        title: i18n.t('pages.users.title')
      }
    }
  ]
}

let reportPages = {
  path: '/report',
  component: DashboardLayout,
  meta:{
    requiresAuth: true,
    roles: ['master', 'administrator', 'administratorRebens'],
    title: i18n.t('pages.report.title')
  },
  children:[
    {
      path: 'customer',
      name: `customer`,
      component: CustomerReport,
      meta: {
        requiresAuth: true,
        roles: ['master', 'administrator', 'administratorRebens'],
        title: i18n.t('pages.report.customer.title')
      }
    },
    {
      path: 'benefit-use',
      name: 'benefit_use',
      props: true,
      component: BenefitUseReport,
      meta: {
        requiresAuth:true,
        roles: ['master', 'administrator', 'administratorRebens'],
        title: i18n.t('pages.report.benefit-use.title')
      }
    }
  ]
}

let operationPartnerPages = {
  path: '/operationPartner',
  component: DashboardLayout,
  meta:{
    requiresAuth: true,
    roles: ['publisher', 'administrator','partnerAdministrator', 'partnerApprover'],
    title: 'Parceiros'
  },
  children:[
    {
      path: '',
      name:'operationPartner',
      component: OperationPartnerList,
      meta:{
        requiresAuth: true,
        roles: ['publisher', 'administrator','partnerAdministrator', 'partnerApprover'],
        title: 'Parceiros'
      }
    },
    {
      path: 'new',
      name: `new_operationPartner`,
      component: OperationPartnerEdit,
      meta: {
        requiresAuth: true,
        roles: ['publisher', 'administrator','partnerAdministrator', 'partnerApprover'],
        title: 'Parceiros'
      }
    },
    {
      path: ':id/edit',
      name: 'edit_operationPartner',
      props: true,
      component: OperationPartnerEdit,
      meta: {
        requiresAuth:true,
        roles: ['publisher', 'administrator','partnerAdministrator', 'partnerApprover'],
        title: 'Parceiros'
      }
    }
  ]
}

let accountPages = {
  path:'/account',
  component: DashboardLayout,
  meta:{
    requiresAuth: true,
    roles: ['master', 'administrator', 'publisher', 'publisherRebens', 'administratorRebens'],
    title: i18n.t('pages.account.title')
  },
  children:[
    {
      path: 'changePassword',
      name: `changePassword`,
      component: ChangePassword,
      meta: {
        requiresAuth: true,
        roles: ['master', 'administrator', 'publisher', 'publisherRebens', 'administratorRebens'],
        title: i18n.t('pages.change-password.title')
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
          roles: ['master', 'administrator', 'publisher', 'publisherRebens', 'administratorRebens', 'partnerAdministrator', 'partnerApprover'],
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
      },
      {
        path: '/passwordRecovery',
        name: i18n.t('pages.password-recovery.title'),
        component: PasswordRecovery,
        meta: {
          requiresAuth: false,
          title: i18n.t('pages.password-recovery.title')
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
      title: 'Validação'
    },
    children: [
      {
        path: '/validate',
        name: 'Validação',
        component: Validate,
        meta: {
          requiresAuth: false,
          title: 'Validação'
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
  accountPages,
  categoriesPages,
  bannersPages,
  partnersPages,
  operationsPages,
  benefitsPages,
  usersPages,
  reportPages,
  pagesPages,
  faqsPages,
  customersPages,
  operationPartnerPages
];

export default routes;
