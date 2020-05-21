export default {
  colors: {
    default: '#344675',
    primary: '#42b883',
    info: '#1d8cf8',
    danger: '#fd5d93',
    orange: '#ff8a76',
    teal: '#00d6b4',
    primaryGradient: [
      'rgba(76, 211, 150, 0.1)',
      'rgba(53, 183, 125, 0)',
      'rgba(119,52,169,0)'
    ],
    purpleGradient: ['rgba(253,93,147,0.8)', 'rgba(253,93,147,0)']
  },
  apiEndpoints: {
    defaultUri: process.env.VUE_APP_API_URI,
    accountUri: process.env.VUE_APP_API_URI.concat('account/'),
    addressUri: process.env.VUE_APP_API_URI.concat('address/'),
    categoryUri: process.env.VUE_APP_API_URI.concat('category/'),
    contactUri: process.env.VUE_APP_API_URI.concat('contact/'),
    helperUri: process.env.VUE_APP_API_URI.concat('helper/'),
    operationUri: process.env.VUE_APP_API_URI.concat('operation/'),
    partnerUri: process.env.VUE_APP_API_URI.concat('partner/'),
    fileUri: process.env.VUE_APP_API_URI.concat('file/'),
    benefitUri: process.env.VUE_APP_API_URI.concat('benefit/'),
    bannerUri: process.env.VUE_APP_API_URI.concat('banner/'),
    staticTextUri: process.env.VUE_APP_API_URI.concat('statictext/'),
    faqUri: process.env.VUE_APP_API_URI.concat('faq/'),
    customerUri: process.env.VUE_APP_API_URI.concat('customer/'),
    userUri: process.env.VUE_APP_API_URI.concat('adminuser/'),
    reportUri: process.env.VUE_APP_API_URI.concat('report/'),
    operationPartnerUri: process.env.VUE_APP_API_URI.concat(
      'operationPartner/'
    ),
    courseCollegeUri: process.env.VUE_APP_API_URI.concat('courseCollege/'),
    courseModalityUri: process.env.VUE_APP_API_URI.concat('courseModality/'),
    courseGraduationTypeUri: process.env.VUE_APP_API_URI.concat(
      'courseGraduationType/'
    ),
    coursePeriodUri: process.env.VUE_APP_API_URI.concat('coursePeriod/'),
    courseUri: process.env.VUE_APP_API_URI.concat('course/'),
    freeCourseUri: process.env.VUE_APP_API_URI.concat('freeCourse/'),
    promoterUri: process.env.VUE_APP_API_URI.concat('promoter/'),
    scratchcardUri: process.env.VUE_APP_API_URI.concat('scratchcard/'),
    scratchcardPrizeUri: process.env.VUE_APP_API_URI.concat(
      'scratchcardPrize/'
    ),
    viaCepUri: process.env.VUE_APP_VIACEP_URI
  },
  customToolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean']
  ],
  stateList: [
    { code: 'AC', label: 'Acre' },
    { code: 'AL', label: 'Alagoas' },
    { code: 'AP', label: 'Amapá' },
    { code: 'AM', label: 'Amazonas' },
    { code: 'BA', label: 'Bahia' },
    { code: 'CE', label: 'Ceará' },
    { code: 'DF', label: 'Distrito Federal' },
    { code: 'ES', label: 'Espírito Santo' },
    { code: 'GO', label: 'Goiás' },
    { code: 'MA', label: 'Maranhão' },
    { code: 'MT', label: 'Mato Grosso' },
    { code: 'MS', label: 'Mato Grosso do Sul' },
    { code: 'MG', label: 'Minas Gerais' },
    { code: 'PA', label: 'Pará' },
    { code: 'PB', label: 'Paraíba' },
    { code: 'PR', label: 'Paraná' },
    { code: 'PE', label: 'Pernambuco' },
    { code: 'PI', label: 'Piauí' },
    { code: 'RJ', label: 'Rio de Janeiro' },
    { code: 'RN', label: 'Rio Grande do Norte' },
    { code: 'RO', label: 'Rondônia' },
    { code: 'RR', label: 'Roraima' },
    { code: 'RS', label: 'Rio Grande do Sul' },
    { code: 'SC', label: 'Santa Catarina' },
    { code: 'SP', label: 'São Paulo' },
    { code: 'SE', label: 'Sergipe' },
    { code: 'TO', label: 'Tocantins' }
  ]
};
