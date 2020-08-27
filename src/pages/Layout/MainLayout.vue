<template>
  <div class="wrapper">
    <notifications></notifications>
    <header>
      <div class="logo">
        <base-link class="simple-text logo-mini" to="/dashboard">
          <img src="/img/logo-rebens.png" alt="Rebens" />
        </base-link>
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
            <li>
              <a href="javascript:void(0)" @click="signout">Sair</a>
            </li>
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
                  <router-link :to="subitem.path">
                    {{ subitem.name }}
                  </router-link>
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
      showMenu: false,
      actualPath: '',
      filteredMenu: [],
      menuItens: [
        {
          name: 'Clientes',
          path: '/promoter',
          active: false,
          roles: 'promoter',
          needModule: '',
          subitens: []
        },
        {
          name: 'Dashboard',
          path: '/dashboard',
          active: false,
          roles:
            'master,administratorRebens,publisherRebens,publisher,administrator',
          needModule: '',
          subitens: []
        },
        {
          name: 'Usuários',
          path: '/users',
          active: false,
          roles:
            'master,administratorRebens,publisherRebens,partnerAdministrator,administrator',
          needModule: '',
          subitens: []
        },
        {
          name: 'Banners',
          path: '/banners',
          active: false,
          roles:
            'master,administrator,administratorRebens,publisherRebens,publisher',
          needModule: '',
          subitens: []
        },
        {
          name: 'Categorias',
          path: '/category',
          active: false,
          roles: 'master,administratorRebens,publisherRebens',
          needModule: '',
          subitens: []
        },
        {
          name: 'Benefícios',
          path: '/benefits',
          active: false,
          roles:
            'master,administratorRebens,publisherRebens,publisher,administrator',
          needModule: '',
          subitens: []
        },
        {
          name: 'Parceiros',
          path: '/partner',
          active: false,
          roles: 'master,administratorRebens,publisherRebens',
          needModule: '',
          subitens: []
        },
        {
          name: 'Contatos',
          path: '/contact',
          active: false,
          roles: 'master,administratorRebens,publisherRebens',
          needModule: '',
          subitens: []
        },
        {
          name: 'Empresas',
          path: '/company',
          active: false,
          roles: 'master,administratorRebens,publisherRebens',
          needModule: '',
          subitens: []
        },
        {
          name: 'Clientes',
          path: '/operationPartner/approve',
          active: false,
          roles: 'partnerAdministrator,partnerApprover',
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
          name: 'Operações',
          path: '#',
          active: false,
          roles: 'master,administratorRebens,publisherRebens,administrator',
          needModule: '',
          subitens: [
            {
              name: 'Clubes',
              path: '/operations',
              active: false,
              roles: 'master,administratorRebens,publisherRebens'
            },
            {
              name: 'Páginas',
              path: '/pages',
              active: false,
              roles: 'master,administratorRebens,publisherRebens,administrator'
            },
            {
              name: 'Parceiros',
              path: '/operationPartner',
              needModule: 'closed-partner',
              active: false,
              roles: 'master,administrator,administratorRebens,administrator'
            }
          ]
        },
        {
          name: 'Clientes',
          path: '#',
          active: false,
          roles: 'master,administrator,administratorRebens,publisherRebens',
          needModule: '',
          subitens: [
            {
              name: 'Clientes',
              path: '/customers',
              active: false,
              roles: 'master,administrator,administratorRebens,publisherRebens'
            },
            {
              name: 'Assinaturas',
              path: '/subscriptions',
              active: false,
              needModule: 'signature',
              roles: 'master,administrator,administratorRebens'
            },
            {
              name: 'Cupom',
              path: '/benefits/validation',
              active: false,
              needModule: 'couponChecker',
              roles: 'master,administrator,administratorRebens,couponChecker'
            },
            {
              name: 'Ingresso',
              path: '/orders',
              active: false,
              needModule: 'ticketChecker',
              roles: 'master,administrator,administratorRebens'
            }
          ]
        },
        {
          name: 'Promotores',
          path: '/promoter/report',
          active: false,
          roles: 'master,administrator,administratorRebens',
          needModule: 'promoter',
          subitens: []
        },
        {
          name: 'Cupons Zanox',
          path: '/zanox',
          active: false,
          roles: 'master,administratorRebens',
          needModule: '',
          subitens: []
        },
        {
          name: 'Validação de Cupom',
          path: '/benefits/validation',
          active: false,
          roles: 'couponChecker',
          needModule: 'couponChecker',
          subitens: []
        },
        {
          name: 'Validação de Ingresso',
          path: '/orders',
          active: false,
          roles: 'ticketChecker',
          needModule: 'ticketChecker',
          subitens: []
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
    isRebens() {
      return (
        this.$store.getters.currentUser.role === 'master' ||
        this.$store.getters.currentUser.role === 'administratorRebens' ||
        this.$store.getters.currentUser.role === 'publisherRebens'
      );
    }
  },
  methods: {
    signout() {
      this.$store.dispatch('removeUser');
      this.$router.push('/login');
    },
    clearMenu() {
      const self = this;
      self.menuItens.forEach(item => {
        item.active = false;
        if (item.subitens) {
          item.subitens.forEach(sub => {
            sub.active = false;
          });
        }
      });
    },
    selectMenu() {
      const self = this;
      self.actualPath = self.$router.currentRoute.path;
      self.menuItens.forEach(item => {
        if (
          item.path === self.actualPath ||
          (self.actualPath.startsWith(item.path) &&
            (self.actualPath.includes('edit') ||
              self.actualPath.includes('new')) &&
            item.path != '/')
        ) {
          item.active = true;
        } else {
          if (item.subitens) {
            item.subitens.forEach(sub => {
              if (
                sub.path === self.actualPath ||
                (self.actualPath.startsWith(sub.path) &&
                  (self.actualPath.includes('edit') ||
                    self.actualPath.includes('new')))
              ) {
                sub.active = true;
                item.active = true;
              }
            });
          }
        }
      });
    },
    filterMenu() {
      const self = this;
      self.filteredMenu = [];
      self.menuItens.forEach(item => {
        if (item.roles === '') {
          self.filteredMenu.push(item);
        } else if (
          item.roles.split(',').includes(self.$store.getters.currentUser.role)
        ) {
          if (
            item.needModule === '' ||
            self.$store.getters.currentUser.modules.includes(item.needModule) ||
            self.isRebens
          ) {
            if (item.subitens && item.subitens.length > 0) {
              item.subitens = item.subitens.filter(sub => {
                if (sub.roles === '') {
                  return true;
                } else if (
                  sub.roles
                    .split(',')
                    .includes(self.$store.getters.currentUser.role)
                ) {
                  if (!sub.needModule || sub.needModule === '') {
                    return true;
                  } else {
                    return (
                      self.$store.getters.currentUser.modules.includes(
                        sub.needModule
                      ) || self.isRebens
                    );
                  }
                } else {
                  return false;
                }
              });

              if (item.subitens.length === 1) {
                item.subitens[0].subitens = [];
                self.filteredMenu.push(item.subitens[0]);
              } else if (item.subitens.length > 1) {
                self.filteredMenu.push(item);
              }
            } else {
              self.filteredMenu.push(item);
            }
          }
        }
      });
    }
  },
  mounted() {
    this.selectMenu();
  },
  updated() {
    if (this.$router.currentRoute.path !== this.actualPath) {
      this.clearMenu();
      this.selectMenu();
    }
  },
  created() {
    this.filterMenu();
  }
};
</script>
