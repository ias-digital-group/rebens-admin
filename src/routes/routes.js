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

const FaqsList = () => import('src/pages/Faqs/List.vue');
const FaqsEdit = () => import('src/pages/Faqs/Edit.vue');

const CustomerList = () => import('src/pages/Customers/List.vue');
const CustomerEdit = () => import('src/pages/Customers/Edit.vue');

const PagesList = () => import('src/pages/Pages/List.vue');
const PagesEdit = () => import('src/pages/Pages/Edit.vue');

const OperationsList = () => import('src/pages/Operations/List.vue');
const OperationsEdit = () => import('src/pages/Operations/Edit.vue');

const BenefitsList = () => import('src/pages/Benefits/List.vue');
const BenefitsEdit = () => import('src/pages/Benefits/Edit.vue');
const BenefitCategoriesList = () =>
  import('src/pages/Benefits/CategoryList.vue');
const BenefitCategoriesEdit = () =>
  import('src/pages/Benefits/CategoryEdit.vue');
const BenefitPartnersList = () => import('src/pages/Benefits/PartnerList.vue');
const BenefitPartnersEdit = () => import('src/pages/Benefits/PartnerEdit.vue');

const BannersList = () => import('src/pages/Banners/List.vue');
const BannersEdit = () => import('src/pages/Banners/Edit.vue');

const UsersList = () => import('src/pages/User/List.vue');
const UsersEdit = () => import('src/pages/User/Edit.vue');

const CustomerReport = () => import('src/pages/Report/Customer.vue');
const BenefitUseReport = () => import('src/pages/Report/BenefitUse.vue');

const OperationPartnerList = () =>
  import('src/pages/OperationPartner/List.vue');
const OperationPartnerEdit = () =>
  import('src/pages/OperationPartner/Edit.vue');
const OperationPartnerApprove = () =>
  import('src/pages/OperationPartner/Approve.vue');
const OperationPartnerCustomers = () =>
  import('src/pages/OperationPartner/Customers.vue');

const CourseList = () => import('src/pages/Course/List.vue');
const CourseEdit = () => import('src/pages/Course/Edit.vue');

const FreeCourseList = () => import('src/pages/FreeCourse/List.vue');
const FreeCourseEdit = () => import('src/pages/FreeCourse/Edit.vue');
const FreeCourseCategoriesList = () =>
  import('src/pages/FreeCourse/CategoryList.vue');
const FreeCourseCategoriesEdit = () =>
  import('src/pages/FreeCourse/CategoryEdit.vue');
const FreeCoursePartnersList = () =>
  import('src/pages/FreeCourse/PartnerList.vue');
const FreeCoursePartnersEdit = () =>
  import('src/pages/FreeCourse/PartnerEdit.vue');

const CourseCollegeList = () => import('src/pages/CourseCollege/List.vue');
const CourseCollegeEdit = () => import('src/pages/CourseCollege/Edit.vue');

const CourseModalityList = () => import('src/pages/CourseModality/List.vue');
const CourseModalityEdit = () => import('src/pages/CourseModality/Edit.vue');

const CourseGraduationTypeList = () =>
  import('src/pages/CourseGraduationType/List.vue');
const CourseGraduationTypeEdit = () =>
  import('src/pages/CourseGraduationType/Edit.vue');

const CoursePeriodList = () => import('src/pages/CoursePeriod/List.vue');
const CoursePeriodEdit = () => import('src/pages/CoursePeriod/Edit.vue');

const ChangePassword = () => import('src/pages/Account/ChangePassword.vue');

const CourseFaqList = () => import('src/pages/CourseFaq/List.vue');
const CourseFaqEdit = () => import('src/pages/CourseFaq/Edit.vue');

const CourseRegulationList = () =>
  import('src/pages/CourseRegulation/List.vue');
const CourseRegulationEdit = () =>
  import('src/pages/CourseRegulation/Edit.vue');

const PromoterList = () => import('src/pages/Promoter/List.vue');
const PromoterEdit = () => import('src/pages/Promoter/Edit.vue');
const PromoterReport = () => import('src/pages/Promoter/Report.vue');

let operationsPages = {
  path: '/operations',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: ['master', 'administratorRebens', 'publisherRebens'],
    title: i18n.t('pages.operations.title')
  },
  children: [
    {
      path: '',
      name: 'operation',
      component: OperationsList,
      meta: {
        requiresAuth: true,
        roles: ['master', 'administratorRebens', 'publisherRebens'],
        title: i18n.t('pages.operations.title')
      }
    },
    {
      path: 'new',
      name: `new_operation`,
      component: OperationsEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'administratorRebens', 'publisherRebens'],
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
        roles: ['master', 'administratorRebens', 'publisherRebens'],
        title: i18n.t('pages.operations.title')
      }
    }
  ]
};

let bannersPages = {
  path: '/banners',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: [
      'master',
      'administrator',
      'publisher',
      'publisherRebens',
      'administratorRebens'
    ],
    title: i18n.t('pages.banners.title')
  },
  children: [
    {
      path: '',
      name: 'banner',
      component: BannersList,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'administrator',
          'publisher',
          'publisherRebens',
          'administratorRebens'
        ],
        title: i18n.t('pages.banners.title')
      }
    },
    {
      path: 'new',
      name: `new_banner`,
      component: BannersEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'administrator',
          'publisher',
          'publisherRebens',
          'administratorRebens'
        ],
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
        roles: [
          'master',
          'administrator',
          'publisher',
          'publisherRebens',
          'administratorRebens'
        ],
        title: i18n.t('pages.banners.title')
      }
    }
  ]
};

let faqsPages = {
  path: '/faqs',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: ['publisher', 'administrator', 'master'],
    title: i18n.t('pages.faqs.title')
  },
  children: [
    {
      path: '',
      name: 'faq',
      component: FaqsList,
      meta: {
        requiresAuth: true,
        roles: ['publisher', 'administrator', 'master'],
        title: i18n.t('pages.faqs.title')
      }
    },
    {
      path: 'new',
      name: `new_faq`,
      component: FaqsEdit,
      meta: {
        requiresAuth: true,
        roles: ['publisher', 'administrator', 'master'],
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
        roles: ['publisher', 'administrator', 'master'],
        title: i18n.t('pages.faqs.title')
      }
    }
  ]
};

let customersPages = {
  path: '/customers',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: ['publisher', 'administrator', 'master'],
    title: 'Pré-cadastro'
  },
  children: [
    {
      path: '',
      name: 'customer',
      component: CustomerList,
      meta: {
        requiresAuth: true,
        roles: ['publisher', 'administrator', 'master'],
        title: 'Pré-cadastro'
      }
    },
    {
      path: 'new',
      name: `new_customer`,
      component: CustomerEdit,
      meta: {
        requiresAuth: true,
        roles: ['publisher', 'administrator', 'master'],
        title: 'Pré-cadastro'
      }
    }
  ]
};

let pagesPages = {
  path: '/pages',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: ['publisher', 'administrator', 'master'],
    title: i18n.t('pages.pages.title')
  },
  children: [
    {
      path: '',
      name: 'page',
      component: PagesList,
      meta: {
        requiresAuth: true,
        roles: ['publisher', 'administrator', 'master'],
        title: i18n.t('pages.pages.title')
      }
    },
    {
      path: 'new',
      name: `new_page`,
      component: PagesEdit,
      meta: {
        requiresAuth: true,
        roles: ['publisher', 'administrator', 'master'],
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
        roles: ['publisher', 'administrator', 'master'],
        title: i18n.t('pages.pages.title')
      }
    }
  ]
};

let benefitsPages = {
  path: '/benefits',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: [
      'master',
      'administrator',
      'publisher',
      'publisherRebens',
      'administratorRebens'
    ],
    title: i18n.t('pages.benefits.title')
  },
  children: [
    {
      path: '',
      name: 'benefit',
      component: BenefitsList,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'administrator',
          'publisher',
          'publisherRebens',
          'administratorRebens'
        ],
        title: i18n.t('pages.benefits.title')
      }
    },
    {
      path: 'new',
      name: `new_benefit`,
      component: BenefitsEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'administrator',
          'publisher',
          'publisherRebens',
          'administratorRebens'
        ],
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
        roles: [
          'master',
          'administrator',
          'publisher',
          'publisherRebens',
          'administratorRebens'
        ],
        title: i18n.t('pages.benefits.title')
      }
    },
    {
      path: 'categories/',
      name: 'category',
      component: BenefitCategoriesList,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: i18n.t('pages.categories.title')
      }
    },
    {
      path: 'categories/new/',
      name: `new_category`,
      component: BenefitCategoriesEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: i18n.t('pages.categories.title')
      }
    },
    {
      path: 'categories/:id/edit/',
      name: 'edit_category',
      props: true,
      component: BenefitCategoriesEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: i18n.t('pages.categories.title')
      }
    },
    {
      path: 'partner/',
      name: 'partner',
      component: BenefitPartnersList,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisherRebens', 'administratorRebens'],
        title: i18n.t('pages.partners.title')
      }
    },
    {
      path: 'partner/new',
      name: `new_partner`,
      component: BenefitPartnersEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisherRebens', 'administratorRebens'],
        title: i18n.t('pages.partners.title')
      }
    },
    {
      path: 'partner/:id/edit',
      name: 'edit_partner',
      props: true,
      component: BenefitPartnersEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisherRebens', 'administratorRebens'],
        title: i18n.t('pages.partners.title')
      }
    }
  ]
};

let usersPages = {
  path: '/users',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: [
      'master',
      'administrator',
      'administratorRebens',
      'partnerAdministrator'
    ],
    title: i18n.t('pages.users.title')
  },
  children: [
    {
      path: '',
      name: 'user',
      component: UsersList,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'administrator',
          'administratorRebens',
          'partnerAdministrator'
        ],
        title: i18n.t('pages.users.title')
      }
    },
    {
      path: 'new',
      name: `new_user`,
      component: UsersEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'administrator',
          'administratorRebens',
          'partnerAdministrator'
        ],
        title: i18n.t('pages.users.title')
      }
    },
    {
      path: ':id/edit',
      name: 'edit_user',
      props: true,
      component: UsersEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'administrator',
          'administratorRebens',
          'partnerAdministrator'
        ],
        title: i18n.t('pages.users.title')
      }
    }
  ]
};

let reportPages = {
  path: '/report',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: ['master', 'administrator', 'administratorRebens'],
    title: i18n.t('pages.report.title')
  },
  children: [
    {
      path: 'customer',
      name: `customerReport`,
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
        requiresAuth: true,
        roles: ['master', 'administrator', 'administratorRebens'],
        title: i18n.t('pages.report.benefit-use.title')
      }
    }
  ]
};

let operationPartnerPages = {
  path: '/operationPartner',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: [
      'publisher',
      'administrator',
      'partnerAdministrator',
      'partnerApprover'
    ],
    title: 'Parceiros'
  },
  children: [
    {
      path: '',
      name: 'operationPartner',
      component: OperationPartnerList,
      meta: {
        requiresAuth: true,
        roles: [
          'publisher',
          'administrator',
          'partnerAdministrator',
          'partnerApprover'
        ],
        title: 'Parceiros'
      }
    },
    {
      path: 'new',
      name: `new_operationPartner`,
      component: OperationPartnerEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'publisher',
          'administrator',
          'partnerAdministrator',
          'partnerApprover'
        ],
        title: 'Parceiros'
      }
    },
    {
      path: ':id/edit',
      name: 'edit_operationPartner',
      props: true,
      component: OperationPartnerEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'publisher',
          'administrator',
          'partnerAdministrator',
          'partnerApprover'
        ],
        title: 'Parceiros'
      }
    },
    {
      path: 'approve',
      name: 'approve_operationPartnerCustomer',
      props: true,
      component: OperationPartnerApprove,
      meta: {
        requiresAuth: true,
        roles: [
          'publisher',
          'administrator',
          'partnerAdministrator',
          'partnerApprover'
        ],
        title: 'Aprovação de Clientes'
      }
    },
    {
      path: 'customers',
      name: 'customers_operationPartnerCustomer',
      props: true,
      component: OperationPartnerCustomers,
      meta: {
        requiresAuth: true,
        roles: ['publisher', 'administrator', 'partnerAdministrator'],
        title: 'Clientes'
      }
    }
  ]
};

let accountPages = {
  path: '/account',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: [
      'master',
      'administrator',
      'publisher',
      'publisherRebens',
      'administratorRebens',
      'promoter'
    ],
    title: i18n.t('pages.account.title')
  },
  children: [
    {
      path: 'changePassword',
      name: `changePassword`,
      component: ChangePassword,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'administrator',
          'publisher',
          'publisherRebens',
          'administratorRebens',
          'promoter'
        ],
        title: i18n.t('pages.change-password.title')
      }
    }
  ]
};

let coursePages = {
  path: '/course',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: [
      'master',
      'publisher',
      'administrator',
      'publisherRebens',
      'administratorRebens'
    ],
    title: 'Cursos'
  },
  children: [
    {
      path: '',
      name: 'course',
      component: CourseList,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Curso'
      }
    },
    {
      path: 'new',
      name: `new_course`,
      component: CourseEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Curso'
      }
    },
    {
      path: ':id/edit',
      name: 'edit_course',
      props: true,
      component: CourseEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Curso'
      }
    }
  ]
};

let courseCollegePages = {
  path: '/courseCollege',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: [
      'master',
      'publisher',
      'administrator',
      'publisherRebens',
      'administratorRebens'
    ],
    title: 'Faculdades'
  },
  children: [
    {
      path: '',
      name: 'college',
      component: CourseCollegeList,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Faculdade'
      }
    },
    {
      path: 'new',
      name: `new_college`,
      component: CourseCollegeEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Faculdade'
      }
    },
    {
      path: ':id/edit',
      name: 'edit_college',
      props: true,
      component: CourseCollegeEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Faculdade'
      }
    }
  ]
};

let courseModalityPages = {
  path: '/courseModality',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: [
      'master',
      'publisher',
      'administrator',
      'publisherRebens',
      'administratorRebens'
    ],
    title: 'Modalidades'
  },
  children: [
    {
      path: '',
      name: 'modality',
      component: CourseModalityList,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Modalidade'
      }
    },
    {
      path: 'new',
      name: `new_modality`,
      component: CourseModalityEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Modalidade'
      }
    },
    {
      path: ':id/edit',
      name: 'edit_modality',
      props: true,
      component: CourseModalityEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Modalidade'
      }
    }
  ]
};

let courseGraduationTypePages = {
  path: '/courseGraduationType',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: [
      'master',
      'publisher',
      'administrator',
      'publisherRebens',
      'administratorRebens'
    ],
    title: 'Tipos de Graduação'
  },
  children: [
    {
      path: '',
      name: 'graduationType',
      component: CourseGraduationTypeList,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Tipo de Graduação'
      }
    },
    {
      path: 'new',
      name: `new_graduationType`,
      component: CourseGraduationTypeEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Tipo de Graduação'
      }
    },
    {
      path: ':id/edit',
      name: 'edit_graduationType',
      props: true,
      component: CourseGraduationTypeEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Tipo de Graduação'
      }
    }
  ]
};

let coursePeriodPages = {
  path: '/coursePeriod',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: [
      'master',
      'publisher',
      'administrator',
      'publisherRebens',
      'administratorRebens'
    ],
    title: 'Períodos'
  },
  children: [
    {
      path: '',
      name: 'period',
      component: CoursePeriodList,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Periodo'
      }
    },
    {
      path: 'new',
      name: `new_period`,
      component: CoursePeriodEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Periodo'
      }
    },
    {
      path: ':id/edit',
      name: 'edit_period',
      props: true,
      component: CoursePeriodEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Periodo'
      }
    }
  ]
};

let freeCoursePages = {
  path: '/freeCourse',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: [
      'master',
      'publisher',
      'administrator',
      'publisherRebens',
      'administratorRebens'
    ],
    title: 'Cursos Livres'
  },
  children: [
    {
      path: '',
      name: 'freeCourse',
      component: FreeCourseList,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Curso Livre'
      }
    },
    {
      path: 'new',
      name: `new_freeCourse`,
      component: FreeCourseEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Curso'
      }
    },
    {
      path: ':id/edit',
      name: 'edit_freeCourse',
      props: true,
      component: FreeCourseEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Curso Livre'
      }
    },
    {
      path: 'categories/',
      name: 'category',
      component: FreeCourseCategoriesList,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: i18n.t('pages.categories.title')
      }
    },
    {
      path: 'categories/new/',
      name: `new_category`,
      component: FreeCourseCategoriesEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: i18n.t('pages.categories.title')
      }
    },
    {
      path: 'categories/:id/edit/',
      name: 'edit_category',
      props: true,
      component: FreeCourseCategoriesEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: i18n.t('pages.categories.title')
      }
    },
    {
      path: 'partner/',
      name: 'partner',
      component: FreeCoursePartnersList,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisherRebens', 'administratorRebens'],
        title: i18n.t('pages.partners.title')
      }
    },
    {
      path: 'partner/new',
      name: `new_partner`,
      component: FreeCoursePartnersEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisherRebens', 'administratorRebens'],
        title: i18n.t('pages.partners.title')
      }
    },
    {
      path: 'partner/:id/edit',
      name: 'edit_partner',
      props: true,
      component: FreeCoursePartnersEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisherRebens', 'administratorRebens'],
        title: i18n.t('pages.partners.title')
      }
    }
  ]
};

let courseFaqPages = {
  path: '/CourseFaq',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: [
      'master',
      'publisher',
      'administrator',
      'publisherRebens',
      'administratorRebens'
    ],
    title: 'Perguntas Frequentes'
  },
  children: [
    {
      path: '',
      name: 'courseFaq',
      component: CourseFaqList,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Perguntas Frequentes'
      }
    },
    {
      path: 'new',
      name: `new_courseFaq`,
      component: CourseFaqEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Perguntas Frequentes'
      }
    },
    {
      path: ':id/edit',
      name: 'edit_courseFaq',
      props: true,
      component: CourseFaqEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Perguntas Frequentes'
      }
    }
  ]
};

let courseRegulationPages = {
  path: '/courseRegulation',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: [
      'master',
      'publisher',
      'administrator',
      'publisherRebens',
      'administratorRebens'
    ],
    title: 'Regulamentos'
  },
  children: [
    {
      path: '',
      name: 'courseRegulation',
      component: CourseRegulationList,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Regulamentos'
      }
    },
    {
      path: 'new',
      name: `new_courseRegulation`,
      component: CourseRegulationEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Regulamento'
      }
    },
    {
      path: ':id/edit',
      name: 'edit_courseRegulation',
      props: true,
      component: CourseRegulationEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Regulamento'
      }
    }
  ]
};

let promoterPages = {
  path: '/promoter',
  component: DashboardLayout,
  meta: {
    requiresAuth: true,
    roles: ['promoter'],
    title: i18n.t('pages.promoter.title')
  },
  children: [
    {
      path: '',
      name: 'promoter',
      component: PromoterList,
      meta: {
        requiresAuth: true,
        roles: ['promoter'],
        title: i18n.t('pages.promoter.title')
      }
    },
    {
      path: 'new',
      name: `new_promoter_customer`,
      component: PromoterEdit,
      meta: {
        requiresAuth: true,
        roles: ['promoter'],
        title: i18n.t('pages.promoter.title')
      }
    },
    {
      path: ':id/edit',
      name: 'edit_promoter_custoemr',
      props: true,
      component: PromoterEdit,
      meta: {
        requiresAuth: true,
        roles: ['promoter'],
        title: i18n.t('pages.promoter.title')
      }
    },
    {
      path: 'report',
      name: 'edit_promoter_report',
      props: true,
      component: PromoterReport,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'administrator',
          'publisherRebens',
          'administratorRebens'
        ],
        title: i18n.t('pages.promoter.title')
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
        components: { default: Dashboard },
        meta: {
          requiresAuth: true,
          roles: [
            'master',
            'administrator',
            'publisher',
            'publisherRebens',
            'administratorRebens',
            'partnerAdministrator',
            'partnerApprover',
            'promoter'
          ],
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
    name: 'Validation',
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
  bannersPages,
  operationsPages,
  benefitsPages,
  usersPages,
  reportPages,
  pagesPages,
  faqsPages,
  customersPages,
  operationPartnerPages,
  courseCollegePages,
  courseGraduationTypePages,
  courseModalityPages,
  coursePeriodPages,
  coursePages,
  courseFaqPages,
  courseRegulationPages,
  freeCoursePages,
  promoterPages
];

export default routes;
