<template>
    <div class="wrapper">
        <header>
            <div class="logo">
                <base-link class="simple-text logo-mini" to="/dashboard"
                ><img src="/img/logo-rebens.png" alt="Rebens"
                /></base-link>
            </div>
        </header>
        <div class="main-content">
            <div class="side-menu">
                <ul>
                    <li><router-link to="/">Dashboard</router-link></li>
                    <li v-show="!isPartnerAdmin">
                        <a href="#" class="parent">Benefícios</a>
                        <ul class="sub-item" hidden>
                            <li><router-link to="/benefits">Benefícios</router-link></li>
                            <li v-show="isRebens"><router-link to="/benefits/categories">Categorias</router-link></li>
                            <li v-show="isRebens"><router-link to="/benefits/partner">Parceiros</router-link></li>
                        </ul>
                    </li>
                    <li v-show="!isPartnerAdmin && !isPartnerApprover"><router-link to="/banners">Banners</router-link></li>
                    <li v-show="isRebens"><router-link to="/operations">Operações</router-link></li>
                    <li v-show="!isPublisher && !isPartnerAdmin"><router-link to="/report/customer">Clientes</router-link></li>
                    <li v-show="!isPublisher"><router-link to="/users">Usuários</router-link></li>
                    <li v-show="showCourses">
                        <a href="#" class="parent">Cursos</a>
                        <ul class="sub-item" hidden>
                            <li><router-link to="/course">Cursos</router-link></li>
                            <li><router-link to="/courseCollege">Faculdades</router-link></li>
                            <li><router-link to="/courseModality">Modalidade</router-link></li>
                            <li><router-link to="/coursePeriod">Períodos</router-link></li>
                            <li><router-link to="/courseGraduationType">Tipo de graduação</router-link></li>
                            <li><router-link to="/courseFaq">Perguntas frequentes</router-link></li>
                            <li><router-link to="/courseRegulation">Regulamento</router-link></li>
                        </ul>
                    </li>
                    <li v-show="showFreeCourses">
                        <a href="#" class="parent">Cursos Livres</a>
                        <ul class="sub-item" hidden>
                            <li><router-link to="/freeCourse">Cursos Livres</router-link></li>
                            <li><router-link to="/freeCourse/categories">Categorias</router-link></li>
                            <li><router-link to="/freeCourse/partner">Parceiros</router-link></li>
                        </ul>
                    </li>
                    <li v-show="!isRebens && !isPartnerAdmin"><router-link to="/customers">Clientes</router-link></li>
                    <li v-show="!isRebens && !isPartnerAdmin"><router-link to="/faqs">Perguntas frequentes</router-link></li>
                    <li v-show="!isRebens && !isPartnerAdmin"><router-link to="/pages">Páginas</router-link></li>
                    <li v-show="showOperationPartner"><router-link to="/operationPartner">Parceiros</router-link></li>
                    <li v-show="showOperationPartner"><router-link to="/operationPartner/approve">Aprovação de clientes</router-link></li>
                    <li v-show="isRebens"><router-link to="/scratchcard">Raspadinhas</router-link></li>
                    <li v-show="!isPublisher && !isPartnerAdmin" class="active">
                        <a href="#">Relatórios</a>
                        <ul class="sub-item">
                            <li><router-link to="/report/benefit-use">Utilização</router-link></li>
                            <li><router-link to="/promoter/report">Promotores</router-link></li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div class="content">
                <router-view></router-view>
            </div>
        </div>
        

    </div>
</template>
<script>

import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}


export default {
  data() {
    return {
      isRebens: false,
      isPublisher: false,
      isPartnerApprover: false,
      isPartnerAdmin: false,
      showCourses: true,
      showFreeCourses: true,
    };
  },
  methods: {
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
      if (this.isPromoter || this.isPartnerApprover) {
        this.$sidebar.displaySidebar(false);
      }
    }
  },
  created() {
    this.isPromoter = this.$store.getters.currentUser.role == 'promoter';
    this.isRebens =
      this.$store.getters.currentUser.role == 'master' ||
      this.$store.getters.currentUser.role == 'administratorRebens' ||
      this.$store.getters.currentUser.role == 'publisherRebens';
    this.isPublisher =
      this.$store.getters.currentUser.role == 'publisher' ||
      this.$store.getters.currentUser.role == 'publisherRebens';
    this.isPartnerApprover =
      this.$store.getters.currentUser.role == 'partnerApprover';
    this.isPartnerAdmin =
      this.$store.getters.currentUser.role == 'partnerAdministrator';
    this.showCourses =
      this.isRebens ||
      this.$store.getters.currentUser.modules.includes('course');
    this.showFreeCourses =
      this.isRebens ||
      this.$store.getters.currentUser.modules.includes('freeCourse');
    this.showOperationPartner = this.$store.getters.currentUser.modules.includes(
      'closed-partner'
    );
  }
};
</script>