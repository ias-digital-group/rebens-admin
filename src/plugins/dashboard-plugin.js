import 'src/polyfills';
import Notifications from 'src/components/ias/NotificationPlugin';
import VeeValidate, { Validator } from 'vee-validate';
import GlobalComponents from './globalComponents';
import GlobalDirectives from './globalDirectives';

import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
locale.use(lang);
import 'src/assets/sass/black-dashboard-pro.scss';
import 'src/assets/css/nucleo-icons.css';
import 'src/assets/css/demo.css';
import ptBr from 'vee-validate/dist/locale/pt_BR';
import 'es6-promise/auto';
import VueTheMask from 'vue-the-mask';

export default {
  install(Vue) {
    Vue.use(GlobalComponents);
    Vue.use(GlobalDirectives);
    Vue.use(Notifications);
    Vue.use(VueTheMask);

    if (process.env.VUE_APP_I18N_LOCALE == 'pt') {
      Validator.localize('pt_BR', ptBr);
      Vue.use(VeeValidate, { fieldsBagName: 'veeFields', locale: ptBr });
    } else {
      Vue.use(VeeValidate, { fieldsBagName: 'veeFields' });
    }
  }
};
