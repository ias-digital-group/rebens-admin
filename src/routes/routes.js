import MainLayout from 'src/pages/Layout/MainLayout.vue';
import DashboardLayout from 'src/pages/Layout/DashboardLayout.vue';
import AuthLayout from 'src/pages/Layout/AuthLayout.vue';
import NotFound from 'src/pages/GeneralViews/NotFoundPage.vue';
import AccessDenied from 'src/pages/GeneralViews/AccessDenied.vue';
import i18n from '../i18n';

const Dashboard = () => import('src/pages/Dashboard/Dashboard.vue');

const CustomerList = () => import('src/pages/Customers/List.vue');
const CustomerCreate = () => import('src/pages/Customers/Create.vue');
const CustomerEdit = () => import('src/pages/Customers/Edit.vue');

const BannersList = () => import('src/pages/Banners/List.vue');
const BannersEdit = () => import('src/pages/Banners/Edit.vue');

const CategoriesList = () => import('src/pages/Category/List.vue');
const CategoriesEdit = () => import('src/pages/Category/Edit.vue');

const UsersList = () => import('src/pages/User/List.vue');
const UsersEdit = () => import('src/pages/User/Edit.vue');

const PartnersList = () => import('src/pages/Partner/List.vue');
const PartnersEdit = () => import('src/pages/Partner/Edit.vue');

const CompanyList = () => import('src/pages/Company/List.vue');
const CompanyEdit = () => import('src/pages/Company/Edit.vue');

const ContactList = () => import('src/pages/Contact/List.vue');
const ContactEdit = () => import('src/pages/Contact/Edit.vue');

const Login = () => import('src/pages/Login/Login.vue');
const PasswordRecovery = () => import('src/pages/Login/PasswordRecovery.vue');
const Validate = () => import('src/pages/Validate/Validate.vue');

const FaqsList = () => import('src/pages/Faqs/List.vue');

const PagesList = () => import('src/pages/Pages/List.vue');
const PagesEdit = () => import('src/pages/Pages/Edit.vue');

const OperationsList = () => import('src/pages/Operations/List.vue');
const OperationsEdit = () => import('src/pages/Operations/Edit.vue');

const BenefitsList = () => import('src/pages/Benefits/List.vue');
const BenefitsEdit = () => import('src/pages/Benefits/Edit.vue');

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

const ScratchcardList = () => import('src/pages/Scratchcard/List.vue');
const ScratchcardEdit = () => import('src/pages/Scratchcard/Edit.vue');
const ScratchcardView = () => import('src/pages/Scratchcard/View.vue');
const ScratchcardPrizeList = () =>
  import('src/pages/Scratchcard/PrizeList.vue');
const ScratchcardPrizeEdit = () =>
  import('src/pages/Scratchcard/PrizeEdit.vue');
const ScratchcardBillets = () => import('src/pages/Scratchcard/Billets.vue');
const ScratchcardPrizedBillets = () =>
  import('src/pages/Scratchcard/PrizedBillets.vue');

const BenefitValidation = () => import('src/pages/Benefits/Validation.vue');
const OrderValidation = () => import('src/pages/Order/Validation.vue');
const SubscriptionList = () => import('src/pages/Subscription/List.vue');
const ZanoxList = () => import('src/pages/Zanox/List.vue');
const ZanoxEdit = () => import('src/pages/Zanox/Edit.vue');
const ZanoxIncentives = () => import('src/pages/Zanox/Incentives.vue');

let bannersPages = {
  path: '/banners',
  component: MainLayout,
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

let categoryPages = {
  path: '/category',
  component: MainLayout,
  meta: {
    requiresAuth: true,
    roles: ['master', 'publisherRebens', 'publisher', 'administratorRebens'],
    title: 'Categoria'
  },
  children: [
    {
      path: '',
      name: 'category',
      component: CategoriesList,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisherRebens',
          'publisher',
          'administratorRebens'
        ],
        title: 'Categoria'
      }
    },
    {
      path: 'new',
      name: `new_category`,
      component: CategoriesEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisherRebens',
          'publisher',
          'administratorRebens'
        ],
        title: 'Categoria'
      }
    },
    {
      path: ':id/edit',
      name: 'edit_category',
      props: true,
      component: CategoriesEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisherRebens',
          'publisher',
          'administratorRebens'
        ],
        title: 'Categoria'
      }
    }
  ]
};

let partnerPages = {
  path: '/partner',
  component: MainLayout,
  meta: {
    requiresAuth: true,
    roles: ['master', 'publisherRebens', 'publisher', 'administratorRebens'],
    title: 'Parceiro'
  },
  children: [
    {
      path: '',
      name: 'partner',
      component: PartnersList,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisherRebens',
          'publisher',
          'administratorRebens'
        ],
        title: 'Parceiro'
      }
    },
    {
      path: 'new',
      name: `new_partner`,
      component: PartnersEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisherRebens',
          'publisher',
          'administratorRebens'
        ],
        title: 'Parceiro'
      }
    },
    {
      path: ':id/edit',
      name: 'edit_partner',
      props: true,
      component: PartnersEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisherRebens',
          'publisher',
          'administratorRebens'
        ],
        title: 'Parceiro'
      }
    }
  ]
};

let companyPages = {
  path: '/company',
  component: MainLayout,
  meta: {
    requiresAuth: true,
    roles: ['master', 'publisherRebens', 'publisher', 'administratorRebens'],
    title: 'Empresa'
  },
  children: [
    {
      path: '',
      name: 'company',
      component: CompanyList,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisherRebens',
          'publisher',
          'administratorRebens'
        ],
        title: 'Empresa'
      }
    },
    {
      path: 'new',
      name: `new_company`,
      component: CompanyEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisherRebens',
          'publisher',
          'administratorRebens'
        ],
        title: 'Empresa'
      }
    },
    {
      path: ':id/edit',
      name: 'edit_company',
      props: true,
      component: CompanyEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisherRebens',
          'publisher',
          'administratorRebens'
        ],
        title: 'Empresa'
      }
    }
  ]
};

let usersPages = {
  path: '/users',
  component: MainLayout,
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
          'partnerAdministrator',
          'publisher',
          'publisherRebens',
          'promoter',
          'partnerApprover',
          'ticketChecker',
          'couponChecker'
        ],
        title: i18n.t('pages.users.title')
      }
    }
  ]
};

let contactPages = {
  path: '/contact',
  component: MainLayout,
  meta: {
    requiresAuth: true,
    roles: ['master', 'publisherRebens', 'publisher', 'administratorRebens'],
    title: 'Contato'
  },
  children: [
    {
      path: '',
      name: 'contact',
      component: ContactList,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisher',
          'publisherRebens',
          'administratorRebens'
        ],
        title: 'Contato'
      }
    },
    {
      path: 'new',
      name: `new_contact`,
      component: ContactEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisherRebens',
          'publisher',
          'administratorRebens'
        ],
        title: 'Contato'
      }
    },
    {
      path: ':id/edit',
      name: 'edit_contact',
      props: true,
      component: ContactEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'publisherRebens',
          'publisher',
          'administratorRebens'
        ],
        title: 'Contato'
      }
    }
  ]
};

let operationsPages = {
  path: '/operations',
  component: MainLayout,
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

let faqsPages = {
  path: '/faqs',
  component: MainLayout,
  meta: {
    requiresAuth: true,
    roles: [
      'publisher',
      'administrator',
      'administratorRebens',
      'publisherRebens',
      'master'
    ],
    title: i18n.t('pages.faqs.title')
  },
  children: [
    {
      path: ':id',
      name: 'faq',
      props: true,
      component: FaqsList,
      meta: {
        requiresAuth: true,
        roles: [
          'publisher',
          'administrator',
          'administratorRebens',
          'publisherRebens',
          'master'
        ],
        title: i18n.t('pages.faqs.title')
      }
    }
  ]
};

let customersPages = {
  path: '/customers',
  component: MainLayout,
  meta: {
    requiresAuth: true,
    roles: [
      'publisherRebens',
      'administratorRebens',
      'publisher',
      'administrator',
      'master'
    ],
    title: 'Clientes'
  },
  children: [
    {
      path: '',
      name: 'customer',
      component: CustomerList,
      meta: {
        requiresAuth: true,
        roles: [
          'publisherRebens',
          'administratorRebens',
          'publisher',
          'administrator',
          'master'
        ],
        title: 'Clientes'
      }
    },
    {
      path: 'new',
      name: `new_customer`,
      component: CustomerCreate,
      meta: {
        requiresAuth: true,
        roles: [
          'publisherRebens',
          'administratorRebens',
          'publisher',
          'administrator',
          'master'
        ],
        title: 'Clientes'
      }
    },
    {
      path: ':id/edit',
      name: 'edit_customer',
      props: true,
      component: CustomerEdit,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'administrator',
          'administratorRebens',
          'publisher',
          'publisherRebens'
        ],
        title: i18n.t('pages.users.title')
      }
    }
  ]
};

let pagesPages = {
  path: '/pages',
  component: MainLayout,
  meta: {
    requiresAuth: true,
    roles: [
      'publisher',
      'administrator',
      'master',
      'publisherRebens',
      'administratorRebens'
    ],
    title: i18n.t('pages.pages.title')
  },
  children: [
    {
      path: '',
      name: 'page',
      component: PagesList,
      meta: {
        requiresAuth: true,
        roles: [
          'publisher',
          'administrator',
          'master',
          'publisherRebens',
          'administratorRebens'
        ],
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
        roles: [
          'publisher',
          'administrator',
          'master',
          'publisherRebens',
          'administratorRebens'
        ],
        title: i18n.t('pages.pages.title')
      }
    }
  ]
};

let orderPages = {
  path: '/orders',
  component: MainLayout,
  meta: {
    requiresAuth: true,
    roles: [
      'master',
      'administrator',
      'publisher',
      'administratorRebens',
      'ticketChecker'
    ],
    title: 'Valida????o de Ingresso'
  },
  children: [
    {
      path: '',
      name: 'orderValidation',
      component: OrderValidation,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'administrator',

          'administratorRebens',
          'ticketChecker',
          'publisher'
        ],
        title: 'Valida????o de Ingresso'
      }
    }
  ]
};

let benefitsPages = {
  path: '/benefits',
  component: MainLayout,
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
      path: 'validation',
      name: 'validation',
      props: true,
      component: BenefitValidation,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'administratorRebens',
          'administrator',
          'couponChecker'
        ],
        title: 'Valida????o de Cupom'
      }
    }
  ]
};

let reportPages = {
  path: '/report',
  component: MainLayout,
  meta: {
    requiresAuth: true,
    roles: ['master', 'administrator', 'publisher', 'administratorRebens'],
    title: i18n.t('pages.report.title')
  },
  children: [
    {
      path: 'customer',
      name: `customerReport`,
      component: CustomerReport,
      meta: {
        requiresAuth: true,
        roles: ['master', 'administrator', 'publisher', 'administratorRebens'],
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
        roles: ['master', 'administrator', 'publisher', 'administratorRebens'],
        title: i18n.t('pages.report.benefit-use.title')
      }
    }
  ]
};

let operationPartnerPages = {
  path: '/operationPartner',
  component: MainLayout,
  meta: {
    requiresAuth: true,
    roles: [
      'master',
      'administrator',
      'administratorRebens',
      'partnerAdministrator',
      'publisher',
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
          'master',
          'administrator',
          'administratorRebens',
          'partnerAdministrator',
          'partnerApprover',
          'publisher'
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
          'master',
          'administrator',
          'administratorRebens',
          'partnerAdministrator',
          'partnerApprover',
          'publisher'
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
          'master',
          'administrator',
          'administratorRebens',
          'partnerAdministrator',
          'partnerApprover',
          'publisher'
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
          'master',
          'administrator',
          'administratorRebens',
          'partnerAdministrator',
          'partnerApprover',
          'publisher'
        ],
        title: 'Aprova????o de Clientes'
      }
    },
    {
      path: 'customers',
      name: 'customers_operationPartnerCustomer',
      props: true,
      component: OperationPartnerCustomers,
      meta: {
        requiresAuth: true,
        roles: [
          'master',
          'administrator',
          'administratorRebens',
          'partnerAdministrator',
          'partnerApprover',
          'publisher'
        ],
        title: 'Clientes'
      }
    }
  ]
};

let accountPages = {
  path: '/account',
  component: MainLayout,
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
          'promoter',
          'partnerApprover',
          'partnerAdministrator',
          'ticketChecker',
          'couponChecker'
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
    title: 'Tipos de Gradua????o'
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
        title: 'Tipo de Gradua????o'
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
        title: 'Tipo de Gradua????o'
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
        title: 'Tipo de Gradua????o'
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
    title: 'Per??odos'
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
      name: 'categoryFreeCourse',
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
      name: `new_categoryFreeCourse`,
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
      name: 'edit_categoryFreeCourse',
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
      name: 'partnerFreeCourse',
      component: FreeCoursePartnersList,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisherRebens', 'administratorRebens'],
        title: i18n.t('pages.partners.title')
      }
    },
    {
      path: 'partner/new',
      name: `new_partnerFreeCourse`,
      component: FreeCoursePartnersEdit,
      meta: {
        requiresAuth: true,
        roles: ['master', 'publisherRebens', 'administratorRebens'],
        title: i18n.t('pages.partners.title')
      }
    },
    {
      path: 'partner/:id/edit',
      name: 'edit_partnerFreeCourse',
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
  component: MainLayout,
  meta: {
    requiresAuth: true,
    roles: ['publisher', 'promoter'],
    title: i18n.t('pages.promoter.title')
  },
  children: [
    {
      path: '',
      name: 'promoter',
      component: PromoterList,
      meta: {
        requiresAuth: true,
        roles: ['promoter', 'publisher'],
        title: i18n.t('pages.promoter.title')
      }
    },
    {
      path: 'new',
      name: `new_promoter_customer`,
      component: PromoterEdit,
      meta: {
        requiresAuth: true,
        roles: ['promoter', 'publisher'],
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
        roles: ['promoter', 'publisher'],
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

let scratchcardPages = {
  path: '/scratchcard/campaigns',
  component: MainLayout,
  meta: {
    requiresAuth: true,
    roles: ['publisherRebens', 'administratorRebens', 'master'],
    title: i18n.t('pages.scratchcard.title')
  },
  children: [
    {
      path: '',
      name: 'scratchcard',
      component: ScratchcardList,
      meta: {
        requiresAuth: true,
        roles: ['publisherRebens', 'administratorRebens', 'master'],
        title: i18n.t('pages.scratchcard.title')
      }
    },
    {
      path: 'new',
      name: `new_scratchcard`,
      component: ScratchcardEdit,
      meta: {
        requiresAuth: true,
        roles: ['publisherRebens', 'administratorRebens', 'master'],
        title: i18n.t('pages.scratchcard.title')
      }
    },
    {
      path: ':id/edit',
      name: 'edit_scratchcard',
      props: true,
      component: ScratchcardEdit,
      meta: {
        requiresAuth: true,
        roles: ['publisherRebens', 'administratorRebens', 'master'],
        title: i18n.t('pages.scratchcard.title')
      }
    },
    {
      path: ':id/view',
      name: 'view_scratchcard',
      props: true,
      component: ScratchcardView,
      meta: {
        requiresAuth: true,
        roles: ['publisherRebens', 'administratorRebens', 'master'],
        title: i18n.t('pages.scratchcard.title')
      }
    }
  ]
};

let scratchcardPrizePages = {
  path: '/scratchcard/prizes',
  component: MainLayout,
  meta: {
    requiresAuth: true,
    roles: ['publisherRebens', 'administratorRebens', 'master'],
    title: i18n.t('pages.scratchcard.title')
  },
  children: [
    {
      path: '',
      name: 'scratchcardPrizes',
      component: ScratchcardPrizeList,
      meta: {
        requiresAuth: true,
        roles: ['publisherRebens', 'administratorRebens', 'master'],
        title: i18n.t('pages.scratchcard.title')
      }
    },
    {
      path: 'new',
      name: `new_scratchcardPrize`,
      component: ScratchcardPrizeEdit,
      meta: {
        requiresAuth: true,
        roles: ['publisherRebens', 'administratorRebens', 'master'],
        title: i18n.t('pages.scratchcard.title')
      }
    },
    {
      path: ':id/edit',
      name: 'edit_scratchcardPrize',
      props: true,
      component: ScratchcardPrizeEdit,
      meta: {
        requiresAuth: true,
        roles: ['publisherRebens', 'administratorRebens', 'master'],
        title: i18n.t('pages.scratchcard.title')
      }
    }
  ]
};

let scratchcardBilletsPages = {
  path: '/scratchcard/billets',
  component: MainLayout,
  meta: {
    requiresAuth: true,
    roles: ['publisherRebens', 'administratorRebens', 'master'],
    title: i18n.t('pages.scratchcard.title')
  },
  children: [
    {
      path: '',
      name: 'scratchcardBillets',
      component: ScratchcardBillets,
      meta: {
        requiresAuth: true,
        roles: ['publisherRebens', 'administratorRebens', 'master'],
        title: i18n.t('pages.scratchcard.title')
      }
    }
  ]
};

let scratchcardPrizedilletsPages = {
  path: '/scratchcard/prizedBillets',
  component: MainLayout,
  meta: {
    requiresAuth: true,
    roles: ['publisherRebens', 'administratorRebens', 'master'],
    title: i18n.t('pages.scratchcard.title')
  },
  children: [
    {
      path: '',
      name: 'scratchcardPrizedBillets',
      component: ScratchcardPrizedBillets,
      meta: {
        requiresAuth: true,
        roles: ['publisherRebens', 'administratorRebens', 'master'],
        title: i18n.t('pages.scratchcard.title')
      }
    }
  ]
};

let subscriptionPages = {
  path: '/subscriptions',
  component: MainLayout,
  meta: {
    requiresAuth: true,
    roles: ['administrator', 'publisher', 'administratorRebens', 'master'],
    title: 'Assinaturas'
  },
  children: [
    {
      path: '',
      name: 'subscriptions',
      component: SubscriptionList,
      meta: {
        requiresAuth: true,
        roles: ['administrator', 'publisher', 'administratorRebens', 'master'],
        title: 'Assinaturas'
      }
    }
  ]
};

const routes = [
  {
    path: '/',
    component: MainLayout,
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
            'administratorRebens',
            'partnerAdministrator',
            'publisher',
            'publisherRebens',
            'promoter',
            'partnerApprover',
            'ticketChecker',
            'couponChecker'
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
      title: 'Valida????o'
    },
    children: [
      {
        path: '/validate',
        name: 'Valida????o',
        component: Validate,
        meta: {
          requiresAuth: false,
          title: 'Valida????o'
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
  {
    path: '/zanox',
    component: MainLayout,
    name: 'Zanox',
    meta: {
      requiresAuth: true,
      title: 'Zanox',
      roles: ['administratorRebens', 'master']
    },
    children: [
      {
        path: 'programs',
        name: 'zanox_list',
        component: ZanoxList,
        meta: {
          requiresAuth: true,
          title: 'Parceiros Zanox',
          roles: ['administratorRebens', 'master']
        }
      },
      {
        path: 'programs/:id/edit',
        name: 'edit_program',
        props: true,
        component: ZanoxEdit,
        meta: {
          requiresAuth: true,
          roles: ['master', 'administratorRebens'],
          title: 'Parceiro Zanox'
        }
      },
      {
        path: 'incentives',
        name: 'incentives',
        props: true,
        component: ZanoxIncentives,
        meta: {
          requiresAuth: true,
          roles: ['master', 'administratorRebens'],
          title: 'Cupons Zanox'
        }
      }
    ]
  },
  bannersPages,
  categoryPages,
  customersPages,
  partnerPages,
  usersPages,
  companyPages,
  contactPages,
  accountPages,
  operationsPages,
  benefitsPages,
  reportPages,
  pagesPages,
  faqsPages,
  operationPartnerPages,
  courseCollegePages,
  courseGraduationTypePages,
  courseModalityPages,
  coursePeriodPages,
  coursePages,
  courseFaqPages,
  courseRegulationPages,
  freeCoursePages,
  promoterPages,
  scratchcardPages,
  orderPages,
  subscriptionPages,
  scratchcardPrizePages,
  scratchcardBilletsPages,
  scratchcardPrizedilletsPages
];

export default routes;
