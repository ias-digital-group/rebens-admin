<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>
    <sidebar-fixed-toggle-button />
    <side-bar
      :background-color="sidebarBackground"
      :short-title="$t('sidebar.shortTitle')"
      :title="$t('sidebar.title')">
      <template slot="links">
        <sidebar-item :link="{ name: $t('sidebar.dashboard'), icon: 'tim-icons icon-chart-pie-36', path: '/dashboard' }"></sidebar-item>
        <sidebar-item v-show="!isPartnerAdmin && !isPartnerApprover" :link="{ name: $t('sidebar.benefits'), icon: 'tim-icons icon-money-coins', path: '/benefits' }"></sidebar-item>
        <sidebar-item v-show="!isPartnerAdmin && !isPartnerApprover" :link="{ name: $t('sidebar.banners'), icon: 'fas fa-file-image', path: '/banners' }"></sidebar-item>
        <sidebar-item v-show="isRebens && !isPartnerAdmin && !isPartnerApprover" :link="{ name: $t('sidebar.categories'), icon: 'tim-icons icon-single-copy-04', path: '/categories' }"></sidebar-item>
        <sidebar-item v-show="isRebens && !isPartnerAdmin && !isPartnerApprover" :link="{ name: $t('sidebar.partners'), icon: 'tim-icons icon-link-72', path: '/partners' }"></sidebar-item>
        <sidebar-item v-show="isRebens && !isPartnerAdmin && !isPartnerApprover" :link="{ name: $t('sidebar.operations'), icon: 'tim-icons icon-bank', path: '/operations' }"></sidebar-item>
        <sidebar-item v-show="!isRebens && !isPartnerAdmin && !isPartnerApprover" :link="{ name: $t('sidebar.faqs'), icon: 'tim-icons icon-bulb-63', path: '/faqs' }"></sidebar-item>    
        <sidebar-item v-show="!isRebens && !isPartnerAdmin && !isPartnerApprover" :link="{ name: $t('sidebar.customers'), icon: 'tim-icons icon-single-02', path: '/customers' }"></sidebar-item>    
        <sidebar-item v-show="!isRebens && !isPartnerAdmin && !isPartnerApprover" :link="{ name: $t('sidebar.pages'), icon: 'tim-icons icon-paper', path: '/pages' }"></sidebar-item>    
        <sidebar-item v-show="!isRebens && !isPublisher && !isPartnerApprover && !isPartnerAdmin" :link="{ name: $t('sidebar.partners'), icon: 'tim-icons icon-link-72', path: '/operationPartner' }"></sidebar-item>    
        <sidebar-item v-show="!isPublisher && !isRebens" :link="{ name: $t('sidebar.partnersApprove'), path: '/operationPartner/approve', icon: 'tim-icons icon-single-02' }"></sidebar-item>    
        <!-- <sidebar-item v-show="!isPublisher && !isRebens && !isPartnerApprover" :link="{ name: $t('sidebar.partnerCustomers'), path: '/operationPartner/customers', icon: 'tim-icons icon-single-02' }"></sidebar-item>     -->
        <sidebar-item v-show="!isPublisher && !isPartnerAdmin && !isPartnerApprover" :link="{ name: $t('sidebar.customer'), path: '/report/customer', icon: 'tim-icons icon-single-02' }"></sidebar-item>
        <sidebar-item v-show="!isPublisher && !isPartnerApprover" :link="{ name: $t('sidebar.users'), path: '/users', icon: 'tim-icons icon-single-02' }"></sidebar-item>    
        <!-- <sidebar-item v-show="!isPublisher && !isPartnerAdmin && !isPartnerApprover" :link="{ name: $t('sidebar.courses'), icon: 'fas fa-graduation-cap' }">
          <sidebar-item v-show="!isPublisher && !isPartnerAdmin && !isPartnerApprover" :link="{ name: $t('sidebar.courses'), path: '/course' }"></sidebar-item>
          <sidebar-item v-show="!isPublisher && !isPartnerAdmin && !isPartnerApprover" :link="{ name: $t('sidebar.courseColleges'), path: '/courseCollege' }"></sidebar-item>
          <sidebar-item v-show="!isPublisher && !isPartnerAdmin && !isPartnerApprover" :link="{ name: $t('sidebar.courseModalities'), path: '/courseModality' }"></sidebar-item>
          <sidebar-item v-show="!isPublisher && !isPartnerAdmin && !isPartnerApprover" :link="{ name: $t('sidebar.coursePeriods'), path: '/coursePeriod' }"></sidebar-item>
          <sidebar-item v-show="!isPublisher && !isPartnerAdmin && !isPartnerApprover" :link="{ name: $t('sidebar.courseGraduationTypes'), path: '/courseGraduationType' }"></sidebar-item>
        </sidebar-item> -->
        <sidebar-item v-show="!isPublisher && !isPartnerAdmin && !isPartnerApprover" :link="{ name: $t('sidebar.report'), icon: 'fas fa-chart-pie' }">
          <sidebar-item v-show="!isPublisher && !isPartnerAdmin && !isPartnerApprover" :link="{ name: $t('sidebar.benefitUse'), path: '/report/benefit-use' }"></sidebar-item>
        </sidebar-item>
        
      </template>
    </side-bar>
    <div class="main-panel" :data="sidebarBackground">
      <dashboard-navbar></dashboard-navbar>
      <router-view name="header"></router-view>

      <div
        :class="{ content: !$route.meta.hideContent }"
        @click="toggleSidebar"
      >
        <zoom-center-transition :duration="200" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </zoom-center-transition>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-new */
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

import DashboardNavbar from './DashboardNavbar.vue';
import ContentFooter from './ContentFooter.vue';
import DashboardContent from './Content.vue';
import SidebarFixedToggleButton from './SidebarFixedToggleButton.vue';
import { SlideYDownTransition, ZoomCenterTransition } from 'vue2-transitions';

export default {
  components: {
    DashboardNavbar,
    ContentFooter,
    SidebarFixedToggleButton,
    DashboardContent,
    SlideYDownTransition,
    ZoomCenterTransition
  },
  data() {
    return {
      isRebens: false,
      isPublisher: false,
      isPartnerApprover:false,
      isPartnerAdmin:false,
      sidebarBackground: 'blue' //vue|blue|orange|green|red|primary
    };
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    initScrollbar() {
      let docClasses = document.body.classList;
      let isWindows = navigator.platform.startsWith('Win');
      if (isWindows) {
        // if we are on windows OS we activate the perfectScrollbar function
        initScrollbar('sidebar');
        initScrollbar('sidebar-wrapper');

        docClasses.add('perfect-scrollbar-on');
      } else {
        docClasses.add('perfect-scrollbar-off');
      }
    }
  },
  created() {
    this.isRebens = this.$store.getters.currentUser.role == "master" || this.$store.getters.currentUser.role == "administratorRebens" || this.$store.getters.currentUser.role == "publisherRebens";
    this.isPublisher = this.$store.getters.currentUser.role == "publisher" || this.$store.getters.currentUser.role == "publisherRebens";
    this.isPartnerApprover = this.$store.getters.currentUser.role == "partnerApprover";
    this.isPartnerAdmin = this.$store.getters.currentUser.role == "partnerAdministrator";
  }
};
</script>
<style lang="scss">
$scaleSize: 0.95;
@keyframes zoomIn95 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  to {
    opacity: 1;
  }
}

.main-panel .zoomIn {
  animation-name: zoomIn95;
}

@keyframes zoomOut95 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}

.main-panel .zoomOut {
  animation-name: zoomOut95;
}
</style>
