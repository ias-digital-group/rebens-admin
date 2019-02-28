import Vue from 'vue';
import DashboardPlugin from './plugins/dashboard-plugin';
import App from './App.vue';
import store from './store/';
// router setup
import router from './routes/router';
import i18n from './i18n';
import axios from 'axios';
import wysiwyg from "vue-wysiwyg";

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
// plugin setup
Vue.use(DashboardPlugin);
Vue.use(wysiwyg, {
  forcePlainTextOnPaste: true,
  hideModules:{
    "code":true, 
    "image":true, 
    "link":true, 
    "table":true, 
    "removeFormat":true, 
    "justifyLeft": true,
    "justifyCenter": true,
    "justifyRight": true,
    "headings": true
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  i18n
});
