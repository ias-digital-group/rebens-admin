<template>
  <div class="wrapper">
    <header>
      <div class="logo">
        <base-link class="simple-text logo-mini" to="/dashboard"
          ><img src="/img/logo-rebens.png" alt="Rebens"
        /></base-link>
      </div>
      <div
        class="user-box"
        :class="{ on: showMenu }"
        @mouseover="showMenu = true"
        @mouseleave="showMenu = false"
      >
        <div class="text">
          <span>{{ fullName }}</span>
          <strong>{{ roleName }}</strong>
        </div>
        <div class="avatar">
          <p v-if="!picture || picture === ''">{{ initials }}</p>
          <img v-else :src="picture" :alt="fullName" />
        </div>
        <div class="user-menu">
          <ul>
            <li>
              <router-link :to="`/users/${userId}/edit/`"
                >Editar Meu perfil</router-link
              >
            </li>
            <li>
              <router-link to="/account/changePassword"
                >Alterar Senha</router-link
              >
            </li>
            <li><a href="javascript:void(0)" @click="signout">Sair</a></li>
          </ul>
        </div>
      </div>
    </header>
    <div class="main-content">
      <div class="side-menu">
        <ul>
          <li
            v-for="(item, idx) in filteredMenu"
            :key="idx"
            :class="{ active: item.active }"
          >
            <template v-if="item.subitens.length > 0">
              <a
                href="javascript:void(0)"
                @click.prevent="item.active = !item.active"
                class="parent"
                >{{ item.name }}</a
              >
              <ul class="sub-item">
                <li v-for="(subitem, idx2) in item.subitens" :key="idx2">
                  <router-link :to="subitem.path">{{
                    subitem.name
                  }}</router-link>
                </li>
              </ul>
            </template>
            <template v-else>
              <router-link :to="item.path">{{ item.name }}</router-link>
            </template>
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
import 'src/assets/sass/app.scss';
import 'src/assets/sass/patterns/icons.css';

export default {
  data() {
    return {
      isPromoter: false,
      isRebens: false,
      isPublisher: false,
      isPartnerApprover: false,
      isPartnerAdmin: false,
      showCourses: true,
      showFreeCourses: true,
      showOperationPartner: false,
      showMenu: false,
      menuItens: [
        {
          name: 'Dashboard',
          path: '/',
          active: false,
          roles: '',
          needModule: '',
          subitens: []
        },
        {
          name: 'Benefícios',
          path: '#',
          active: false,
          roles: 'master,administratorRebens,publisherRebens,publisher',
          needModule: '',
          subitens: [
            {
              name: 'Benefícios',
              path: '/benefits',
              active: false,
              roles: 'master,administratorRebens,publisherRebens,publisher'
            },
            {
              name: 'Categorias',
              path: '/benefits/categories',
              active: false,
              roles: 'master,administratorRebens,publisherRebens'
            },
            {
              name: 'Parceiros',
              path: '/benefits/partner',
              active: false,
              roles: 'master,administratorRebens,publisherRebens'
            }
          ]
        },
        {
          name: 'Banners',
          path: '/banners',
          active: false,
          roles: 'master,administratorRebens,publisherRebens,publisher',
          needModule: '',
          subitens: []
        },
        {
          name: 'Operações',
          path: '/operations',
          active: false,
          roles: 'master,administratorRebens,publisherRebens',
          needModule: '',
          subitens: []
        },
        {
          name: 'Clientes',
          path: '/report/customer',
          active: false,
          roles: 'master,administratorRebens,publisherRebens',
          needModule: '',
          subitens: []
        },
        {
          name: 'Usuários',
          path: '/users',
          active: false,
          roles:
            'master,administratorRebens,publisherRebens,partnerAdministrator',
          needModule: '',
          subitens: []
        },
        {
          name: 'Cursos',
          path: '#',
          active: false,
          roles: 'master,administratorRebens,publisherRebens,publisher',
          needModule: 'course',
          subitens: [
            { name: 'Cursos', path: '/course', active: false, roles: '' },
            {
              name: 'Faculdades',
              path: '/courseCollege',
              active: false,
              roles: ''
            },
            {
              name: 'Modalidade',
              path: '/courseModality',
              active: false,
              roles: ''
            },
            {
              name: 'Períodos',
              path: '/coursePeriod',
              active: false,
              roles: ''
            },
            {
              name: 'Tipo de graduação',
              path: '/courseGraduationType',
              active: false,
              roles: ''
            },
            {
              name: 'Perguntas frequentes',
              path: '/courseFaq',
              active: false,
              roles: ''
            },
            {
              name: 'Regulamento',
              path: '/courseRegulation',
              active: false,
              roles: ''
            }
          ]
        },
        {
          name: 'Cursos Livres',
          path: '#',
          active: false,
          roles: 'master,administratorRebens,publisherRebens,publisher',
          needModule: 'freeCourse',
          subitens: [
            {
              name: 'Cursos Livres',
              path: '/freeCourse',
              active: false,
              roles: ''
            },
            {
              name: 'Categorias',
              path: '/freeCourse/categories',
              active: false,
              roles: ''
            },
            {
              name: 'Parceiros',
              path: '/freeCourse/partner',
              active: false,
              roles: ''
            }
          ]
        },
        {
          name: 'Clientes',
          path: '/customers',
          active: false,
          roles: 'publisher',
          needModule: '',
          subitens: []
        },
        {
          name: 'Perguntas frequentes',
          path: '/faqs',
          active: false,
          roles: 'publisher',
          needModule: '',
          subitens: []
        },
        {
          name: 'Páginas',
          path: '/pages',
          active: false,
          roles: 'publisher',
          needModule: '',
          subitens: []
        },
        {
          name: 'Parceiros',
          path: '/operationPartner',
          active: false,
          roles: 'partnerAdministrator',
          needModule: '',
          subitens: []
        },
        {
          name: 'Aprovação de clientes',
          path: '/operationPartner/approve',
          active: false,
          roles: 'partnerAdministrator',
          needModule: '',
          subitens: []
        },
        {
          name: 'Raspadinhas',
          path: '/scratchcard',
          active: false,
          roles: 'master,administratorRebens,publisherRebens',
          needModule: '',
          subitens: []
        },
        {
          name: 'Relatórios',
          path: '#',
          active: false,
          roles: 'master,administratorRebens',
          subitens: [
            {
              name: 'Utilização',
              path: '/report/benefit-use',
              active: false,
              roles: ''
            },
            {
              name: 'Promotores',
              path: '/promoter/report',
              active: false,
              roles: ''
            }
          ]
        }
      ]
    };
  },
  computed: {
    picture() {
      return this.$store.getters.currentUser.picture;
    },
    roleName() {
      return this.$store.getters.currentUser.roleName;
    },
    fullName() {
      return (
        this.$store.getters.currentUser.name +
        ' ' +
        this.$store.getters.currentUser.surname
      );
    },
    userId() {
      return this.$store.getters.currentUser.id;
    },
    initials() {
      return this.$store.getters.currentUser.initials;
    },
    filteredMenu() {
      return this.menuItens.filter(item => {
        if (item.roles === '') {
          return true;
        } else if (item.roles.includes(this.$store.getters.currentUser.role)) {
          if (item.needModule === '') {
            return true;
          } else if (this.$store.getters.currentUser.role === 'publisher') {
            return this.$store.getters.currentUser.modules.includes('course');
          } else {
            return true;
          }
        }
        return false;
      });
    }
  },
  methods: {
    signout() {
      this.$store.dispatch('removeUser');
      this.$router.push('/login');
    }
  }
};
</script>
