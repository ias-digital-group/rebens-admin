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
    accountUri: process.env.VUE_APP_API_URI.concat('account/'),
    addressUri: process.env.VUE_APP_API_URI.concat('address/'),
    categoryUri: process.env.VUE_APP_API_URI.concat('category/'),
    contactUri: process.env.VUE_APP_API_URI.concat('contact/'),
    helperUri: process.env.VUE_APP_API_URI.concat('helper/'),
    operationUri: process.env.VUE_APP_API_URI.concat('operation/'),
    partnerUri: process.env.VUE_APP_API_URI.concat('partner/'),
    benefitUri: process.env.VUE_APP_API_URI.concat('benefit/'),
    bannerUri: process.env.VUE_APP_API_URI.concat('banner/'),
    staticTextUri: process.env.VUE_APP_API_URI.concat('statictext/'),
    faqUri: process.env.VUE_APP_API_URI.concat('faq/'),
    userUri: process.env.VUE_APP_API_URI.concat('adminuser/'),
    reportUri: process.env.VUE_APP_API_URI.concat('report/'),
    operationPartnerUri: process.env.VUE_APP_API_URI.concat('operationPartner/'),
    courseCollegeUri: process.env.VUE_APP_API_URI.concat('courseCollege/'),
    courseModalityUri: process.env.VUE_APP_API_URI.concat('courseModality/'),
    courseGraduationTypeUri: process.env.VUE_APP_API_URI.concat('courseGraduationType/'),
    coursePeriodUri: process.env.VUE_APP_API_URI.concat('coursePeriod/'),
    courseUri: process.env.VUE_APP_API_URI.concat('course/'),
    viaCepUri: process.env.VUE_APP_VIACEP_URI
  }
};
