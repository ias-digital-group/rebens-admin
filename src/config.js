export default {
  colors: {
    default: '#344675',
    primary: '#42b883',
    info: '#41b0ce',
    danger: '#fd5d93',
    orange: '#ff8a76',
    teal: '#00d6b4',
    primaryGradient: [
      'rgba(65,176,206,1)',
      'rgba(65,176,206,1)',
      'rgba(65,176,206,1)'
    ],
    purpleGradient: ['rgba(65,176,206,1)', 'rgba(65,176,206,1)']
  },
  apiEndpoints: {
    defaultUri: process.env.VUE_APP_API_URI,
    accountUri: process.env.VUE_APP_API_URI.concat('account/'),
    addressUri: process.env.VUE_APP_API_URI.concat('address/'),
    categoryUri: process.env.VUE_APP_API_URI.concat('category/'),
    companyUri: process.env.VUE_APP_API_URI.concat('company/'),
    contactUri: process.env.VUE_APP_API_URI.concat('contact/'),
    helperUri: process.env.VUE_APP_API_URI.concat('helper/'),
    operationUri: process.env.VUE_APP_API_URI.concat('operation/'),
    partnerUri: process.env.VUE_APP_API_URI.concat('partner/'),
    fileUri: process.env.VUE_APP_API_URI.concat('file/'),
    orderUri: process.env.VUE_APP_API_URI.concat('order/'),
    benefitUri: process.env.VUE_APP_API_URI.concat('benefit/'),
    bannerUri: process.env.VUE_APP_API_URI.concat('banner/'),
    staticTextUri: process.env.VUE_APP_API_URI.concat('statictext/'),
    faqUri: process.env.VUE_APP_API_URI.concat('faq/'),
    customerUri: process.env.VUE_APP_API_URI.concat('customer/'),
    userUri: process.env.VUE_APP_API_URI.concat('adminuser/'),
    wirecardUri: process.env.VUE_APP_API_URI.concat('wirecard/'),
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
    zanoxUri: process.env.VUE_APP_API_URI.concat('ZanoxProgram/'),
    viaCepUri: process.env.VUE_APP_VIACEP_URI
  },
  customToolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: '' }, { align: 'center' }],
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
  ],
  getRoles: user => {
    var roles = [];
    if (user.role === 'ticketChecker')
      roles.push({ code: 'ticketChecker', label: 'Validador Ingresso' });
    else if (user.role === 'couponChecker')
      roles.push({ code: 'couponChecker', label: 'Validador Cupom' });
    else if (user.role === 'promoter')
      roles.push({ code: 'promoter', label: 'Promotor' });
    else if (user.role === 'partnerApprover')
      roles.push({ code: 'partnerApprover', label: 'Aprovador Parceiro' });
    else if (user.role === 'publisher')
      roles.push({ code: 'publisher', label: 'Publicador' });
    else if (user.role === 'publisherRebens')
      roles.push({ code: 'publisherRebens', label: 'Publicador Rebens' });
    else if (user.role === 'partnerAdministrator') {
      roles.push({
        code: 'partnerAdministrator',
        label: 'Administrador Parceiro'
      });
      roles.push({ code: 'partnerApprover', label: 'Aprovador Parceiro' });
    } else if (user.role === 'master' || user.role === 'administratorRebens') {
      roles.push({ code: 'administrator', label: 'Administrador' });
      roles.push({ code: 'partnerAdministrator', label: 'Admin Parceiro' });
      roles.push({
        code: 'administratorRebens',
        label: 'Administrador Rebens'
      });
      roles.push({ code: 'partnerApprover', label: 'Aprovador Parceiro' });
      if (user.role === 'master')
        roles.push({ code: 'master', label: 'Master' });
      roles.push({ code: 'promoter', label: 'Promotor' });
      roles.push({ code: 'publisher', label: 'Publicador' });
      roles.push({ code: 'publisherRebens', label: 'Publicador Rebens' });
      roles.push({ code: 'couponChecker', label: 'Validador Cupom' });
      roles.push({ code: 'ticketChecker', label: 'Validador Ingresso' });
    } else {
      roles.push({ code: 'administrator', label: 'Administrador' });
      if (user.modules.includes('closed-partner')) {
        roles.push({ code: 'partnerAdministrator', label: 'Admin Parceiro' });
        roles.push({ code: 'partnerApprover', label: 'Aprovador Parceiro' });
      }
      if (user.modules.includes('promoter'))
        roles.push({ code: 'promoter', label: 'Promotor' });
      roles.push({ code: 'publisher', label: 'Publicador' });
      if (user.modules.includes('couponChecker'))
        roles.push({ code: 'couponChecker', label: 'Validador Cupom' });
      if (user.modules.includes('ticketChecker'))
        roles.push({ code: 'ticketChecker', label: 'Validador Ingresso' });
    }
    return roles;
  }
};
