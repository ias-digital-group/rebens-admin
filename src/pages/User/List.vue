<template>
  <div class="list-box">
    <div class="list-header">
      <h2>{{ $t('pages.users.title') }}</h2>
      <div class="box-actions">
        <div class="input-post-icon search">
          <input type="text" v-model="searchQuery">
          <i>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.8812 17.7023L14.1937 13.0148C15.2187 11.7315 15.8333 10.1042 15.8333 8.33333C15.8333 4.19166 12.4749 0.833328 8.33325 0.833328C4.19159 0.833328 0.833252 4.19166 0.833252 8.33333C0.833252 12.475 4.19159 15.8333 8.33325 15.8333C10.1041 15.8333 11.7314 15.2187 13.0147 14.1937L17.7022 18.8812C17.8645 19.0437 18.0797 19.125 18.2916 19.125C18.5043 19.125 18.7187 19.0437 18.8812 18.8812C19.206 18.5562 19.206 18.0269 18.8812 17.7023ZM8.33325 14.1667C5.11159 14.1667 2.49992 11.555 2.49992 8.33333C2.49992 5.11166 5.11159 2.49999 8.33325 2.49999C11.5549 2.49999 14.1666 5.11166 14.1666 8.33333C14.1666 11.555 11.5549 14.1667 8.33325 14.1667Z" fill="#41B0CE"/>
            </svg>
          </i>
        </div>
        <div class="filter" :class="{ active: showFilters }">
          <a class="bt bt-square bg-white-2 c-primay" @click="showFilters = !showFilters">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.8975 0.66381C24.0904 1.12904 24.011 1.5262 23.6592 1.85526L15.268 10.2465V22.8759C15.268 23.3525 15.0467 23.6872 14.6042 23.8801C14.4567 23.9369 14.3148 23.9652 14.1787 23.9652C13.8723 23.9652 13.617 23.8575 13.4127 23.6419L9.05541 19.2845C8.83981 19.0689 8.73201 18.8136 8.73201 18.5186V10.2465L0.34077 1.85526C-0.0109926 1.5262 -0.0904229 1.12904 0.102479 0.66381C0.295381 0.22127 0.630123 0 1.10671 0H22.8933C23.3699 0 23.7046 0.22127 23.8975 0.66381Z" fill="#41B0CE"/>
            </svg>
          </a>
        </div>
        <base-link to="/users/new" class="bt bt-square bg-white-2 c-primay" >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.5 9H15V1.5C15 0.675 14.325 0 13.5 0H10.5C9.675 0 9 0.675 9 1.5V9H1.5C0.675 9 0 9.675 0 10.5V13.5C0 14.325 0.675 15 1.5 15H9V22.5C9 23.325 9.675 24 10.5 24H13.5C14.325 24 15 23.325 15 22.5V15H22.5C23.325 15 24 14.325 24 13.5V10.5C24 9.675 23.325 9 22.5 9Z" fill="#41B0CE"/>
          </svg>
        </base-link>
      </div>
      <div class="filters" v-show="showFilters">
        <v-select
          :options="operations"
          :reduce="op => op.code"
          :key="operationFilter"
          v-model="operationFilter"
          class="no-margin"
          placeholder="Filtre pelo Clube"
        >
        </v-select>
        <v-select
          :options="operationPartners"
          :reduce="op => op.code"
          :key="operationPartnerFilter"
          v-model="operationPartnerFilter"
          placeholder="Filtre por Empresa"
        >
        </v-select>
        <v-select
          :options="roles"
          :reduce="op => op.code"
          :key="roleFilter"
          v-model="roleFilter"
          v-show="isRebens"
          placeholder="Filtre pelo Papel"
        >
        </v-select>
        <v-select
          :options="statuses"
          :reduce="op => op.code"
          :key="activeFilter"
          v-model="activeFilter"
          placeholder="Filtre pelo Status"
        >
        </v-select>
      </div>
    </div>
    <div class="list-table">
      <table v-loading="loading">
        <thead>
          <tr>
            <th>Nome / E-mail</th>
            <th>Clube / Empresa</th>
            <th>Papel</th>
            <th style="width:192px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td class="td-flex">
              <div class="avatar">
                <span>FB</span>
              </div>
              <div class="two-lines">
                <span>{{item.name}}</span>
                <span class="blue">{{item.email}}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{item.idOperation}}</span>
                <span class="blue">{{item.idOperationPartner}}</span>
              </div>
            </td>
            <td>
              <span>{{item.roleName}}</span>
            </td>
            <td class="actions">
              <button @click="toggleActive(item)" type="button" :title="item.active ? 'Inativar' : 'Ativar'" class="bt" :class="{ 'c-green': item.active, 'c-dark-gray': !item.active }">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle opacity="0.7" cx="12" cy="12" r="12" fill="currentColor"/>
                  <path d="M16.7609 9.44996L10.8087 15.4021C10.7563 15.4546 10.6714 15.4546 10.6191 15.4021L7.23942 12.0224C7.18712 11.9702 7.18712 11.8853 7.23942 11.8329L8.06063 11.0117C8.11306 10.9594 8.19795 10.9594 8.25026 11.0117L10.714 13.4753L15.7502 8.43913C15.8027 8.38683 15.8874 8.38683 15.9398 8.43913L16.7609 9.26034C16.8133 9.31265 16.8133 9.39741 16.7609 9.44996Z" fill="white"/>
                </svg>
              </button>
              <button @click="handleResendPassword(item)" type="button" title="Reenviar validação" class="bt">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.4102 16.4991L8 19.3642V24L21 7L10.4102 16.4991Z" fill="#FFC229"/>
                  <path d="M0 12.1765L7.476 16.2218H7.484L18.6667 6.76471L10.3667 16.7183L12 18.6449L20 23L24 0L0 12.1765Z" fill="#FFC229"/>
                </svg>
              </button>
              <button @click="handleEdit(item)" type="button" title="Editar" class="bt">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.3608 3.89483L20.0881 0.61936C19.2635 -0.205925 17.8291 -0.20751 17.0013 0.620945L2.34016 15.4267C2.27517 15.4923 2.22827 15.5728 2.20271 15.6613L0.0209354 23.3041C-0.0334222 23.4944 0.0198615 23.6997 0.159974 23.8399C0.263832 23.9439 0.40287 23.9999 0.545642 23.9999C0.595704 23.9999 0.646329 23.9929 0.695317 23.9791L8.33161 21.7954C8.42003 21.7698 8.50047 21.7229 8.56597 21.6578L23.3608 6.98268C23.7731 6.57006 24 6.02198 24 5.43878C24 4.85557 23.7731 4.30744 23.3608 3.89483ZM14.6244 4.58869L16.6322 6.5965L6.14949 17.0792L5.39717 15.5741C5.30446 15.3892 5.11592 15.2726 4.90923 15.2726H4.03573L14.6244 4.58869ZM1.33984 22.6602L2.05032 20.1731L3.82689 21.9496L1.33984 22.6602ZM7.63647 20.8614L5.02674 21.6069L2.39308 18.9732L3.1386 16.3635H4.57199L5.51213 18.2438C5.56485 18.3493 5.6506 18.435 5.7561 18.4878L7.63642 19.4279V20.8614H7.63647ZM8.72741 19.9643V19.0908C8.72741 18.8841 8.61077 18.6955 8.42591 18.6028L6.92077 17.8505L17.4035 7.36783L19.4113 9.37564L8.72741 19.9643ZM22.5911 6.22417L20.186 8.60778L15.3922 3.81393L17.7742 1.41049C18.1865 0.998175 18.9045 0.998175 19.3168 1.41049L22.5895 4.68319C22.7956 4.88932 22.9091 5.1631 22.9091 5.45448C22.9091 5.74585 22.7956 6.01963 22.5911 6.22417Z" fill="#41B0CE"/>
                </svg>
              </button>
              <button @click="handleDelete(item)" type="button" title="apagar" class="bt">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0)">
                    <path d="M15.3106 8.69531C15.0001 8.69531 14.7485 8.94692 14.7485 9.25737V19.8803C14.7485 20.1905 15.0001 20.4424 15.3106 20.4424C15.621 20.4424 15.8727 20.1905 15.8727 19.8803V9.25737C15.8727 8.94692 15.621 8.69531 15.3106 8.69531Z" fill="#EB5757"/>
                    <path d="M8.67803 8.69531C8.36758 8.69531 8.11597 8.94692 8.11597 9.25737V19.8803C8.11597 20.1905 8.36758 20.4424 8.67803 20.4424C8.98848 20.4424 9.24009 20.1905 9.24009 19.8803V9.25737C9.24009 8.94692 8.98848 8.69531 8.67803 8.69531Z" fill="#EB5757"/>
                    <path d="M3.84439 7.14503V20.993C3.84439 21.8115 4.14452 22.5801 4.66881 23.1317C5.19069 23.6847 5.91698 23.9987 6.67708 24H17.3114C18.0717 23.9987 18.798 23.6847 19.3197 23.1317C19.844 22.5801 20.1441 21.8115 20.1441 20.993V7.14503C21.1863 6.86839 21.8617 5.86152 21.7223 4.79207C21.5826 3.72284 20.6717 2.923 19.5932 2.92278H16.7155V2.22021C16.7188 1.62939 16.4852 1.06206 16.067 0.644685C15.6487 0.227532 15.0805 -0.00475634 14.4897 7.385e-05H9.49879C8.90797 -0.00475634 8.33976 0.227532 7.92151 0.644685C7.50326 1.06206 7.26966 1.62939 7.27295 2.22021V2.92278H4.39525C3.3168 2.923 2.40587 3.72284 2.26623 4.79207C2.12681 5.86152 2.80216 6.86839 3.84439 7.14503ZM17.3114 22.8759H6.67708C5.71609 22.8759 4.96851 22.0504 4.96851 20.993V7.19443H19.02V20.993C19.02 22.0504 18.2724 22.8759 17.3114 22.8759ZM8.39707 2.22021C8.39333 1.92754 8.50838 1.64585 8.71608 1.43925C8.92356 1.23265 9.2059 1.11914 9.49879 1.12419H14.4897C14.7826 1.11914 15.0649 1.23265 15.2724 1.43925C15.4801 1.64563 15.5952 1.92754 15.5914 2.22021V2.92278H8.39707V2.22021ZM4.39525 4.0469H19.5932C20.152 4.0469 20.6049 4.49984 20.6049 5.05861C20.6049 5.61737 20.152 6.07031 19.5932 6.07031H4.39525C3.83648 6.07031 3.38354 5.61737 3.38354 5.05861C3.38354 4.49984 3.83648 4.0469 4.39525 4.0469Z" fill="#EB5757"/>
                    <path d="M11.9944 8.69531C11.684 8.69531 11.4324 8.94692 11.4324 9.25737V19.8803C11.4324 20.1905 11.684 20.4424 11.9944 20.4424C12.3049 20.4424 12.5565 20.1905 12.5565 19.8803V9.25737C12.5565 8.94692 12.3049 8.69531 11.9944 8.69531Z" fill="#EB5757"/>
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <path d="M0 0H24V24H0V0Z" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <pagination
        class="box-pagination"
        v-model="pagination.currentPage"
        :per-page="pagination.perPage"
        :total-items="pagination.totalItems"
        :total-pages="pagination.totalPages"
        :current-page="pagination.currentPage"
        v-on:input="onPageChanged"
        @update-per-page="changePerPage"
      >
      </pagination>
    </div>
    <modal :show.sync="modal.visible" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Remover usuário</h4>
      <form
        class="modal-form"
        ref="modalForm"
        @submit.prevent
        v-loading="modal.formLoading"
      >
        <input type="hidden" name="nome" value="DELETE" ref="nome" />
        <base-input
          required
          v-model="modal.nameConfirmation"
          label="Digite DELETE para confirmar"
          placeholder="Digite DELETE para confirmar"
          :error="getError('confirmação')"
          type="text"
          v-validate="modal.modelValidations.name_confirm"
          name="confirmação"
        >
        </base-input>
      </form>
      <template slot="footer">
        <base-button @click.native.prevent="validateModal" type="danger"
          >Remover</base-button
        >
        <base-button type="info" @click.native="modal.visible = false"
          >Fechar</base-button
        >
      </template>
    </modal>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from 'element-ui';
import { Modal, Pagination } from 'src/components';
import userService from '../../services/User/userService';
import operationService from '../../services/Operation/operationService';
import operationPartnerService from '../../services/OperationPartner/operationPartnerService';
import paging from '../../mixins/paging';
export default {
  mixins: [paging],
  components: {
    Modal,
    Pagination,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      internalName: 'pages.users.list',
      sortField: 'name',
      activeFilter: '',
      roleFilter: '',
      operationFilter: '',
      operationPartnerFilter: '',
      isMaster: false,
      isRebens: false,
      showFilters: false,
      operations: [],
      operationPartners: [],
      roles: [],
      statuses: [
        { code: true, label: 'Ativos'},
        { code: false, label: 'Inativos'},
      ]
    };
  },
  methods: {
    handleEdit(row) {
      this.$router.push(`/users/${row.id}/edit/`);
    },
    toggleActive(row) {
      userService.toggleActive(row.id).then(
        data => {
          if(data.status === 'ok') {
            row.active = data.data;
          }
        }
      );
    },
    handleResendPassword(row) {
      if (confirm('Deseja reenviar o e-mail de validação?')) {
        const self = this;
        self.$data.loading = true;
        userService.resendValidation(row.id).then(
          () => {
            self.$notify({
              type: 'success',
              message: 'E-mail reenviado com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            self.$data.loading = false;
          },
          () => {
            self.$data.loading = false;
          }
        );
      }
    },
    fetchData() {
      const self = this;
      const request = {
        page: self.$data.pagination.currentPage - 1,
        pageItems: self.$data.pagination.perPage,
        searchWord: self.searchQuery,
        sort: self.formatSortFieldParam,
        active: self.activeFilter ? self.activeFilter : '',
        role: self.roleFilter ? self.roleFilter : '',
        idOperation: self.operationFilter ? self.operationFilter : '',
        idOperationPartner: self.operationPartnerFilter ? self.operationPartnerFilter : ''
      };
      console.log('filters', request);
      this.$data.loading = true;
      userService.findAll(request).then(
        response => {
          self.$data.tableData = response.data;
          self.savePageSettings(self, response.totalItems, response.totalPages);
          self.$data.loading = false;
        },
        () => {
          self.$data.loading = false;
        }
      );
      if(self.roles.length === 0) {
        self.populateFilters(self);
      }
    },
    validateModal() {
      const self = this;
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          self.modal.formLoading = true;
          userService.delete(self.modal.model.id).then(
            response => {
              self.$notify({
                type: 'primary',
                message: response.message,
                icon: 'tim-icons icon-bell-55'
              });
              self.resetModal();
              self.pagination.currentPage = 1;
              self.fetchData();
            },
            err => {
              self.$notify({
                type: 'primary',
                message: err.message,
                icon: 'tim-icons icon-bell-55'
              });
              self.modal.formLoading = false;
            }
          );
        }
      });
    },
    populateFilters(self) {
      self.isMaster = self.$store.getters.currentUser.role === 'master';
      self.isRebens =
        self.$store.getters.currentUser.role === 'administratorRebens' ||
        self.$store.getters.currentUser.role === 'master';

      self.roles = [];
      if (self.isMaster) {
        self.roles.push({ code: 'master', label: 'Master' });
      }
      if (!self.isPartnerUser) {
        self.roles.push({ code: 'publisher', label: 'Publicador' });
        self.roles.push({ code: 'administrator', label: 'Administrador' });
        if (self.isRebens) {
          self.roles.push({
            code: 'publisherRebens',
            label: 'Publicador Rebens'
          });
          self.roles.push({
            code: 'administratorRebens',
            label: 'Administrador Rebens'
          });
        }
      }
      self.roles.push({
        code: 'partnerAdministrator',
        label: 'Administrador Parceiro'
      });
      self.roles.push({ code: 'partnerApprover', label: 'Aprovador Parceiro' });
      self.roles.push({ code: 'promoter', label: 'Promotor' });

      operationService.findAll().then(
        response => {
          _.each(response.data, function(el) {
            if (el.id != self.id) {
              self.operations.push({ code: el.id, label: el.title });
            }
          });
        }
      );

      operationPartnerService
            .findAll({
              page: 0,
              pageItems: 1000,
              searchWord: '',
              sort: 'name ASC',
              idOperation: ''
            })
            .then(
              response => {
                console.log('Partners response', response);
                _.each(response.data, function(el) {
                    self.operationPartners.push({
                      code: el.id,
                      label: el.name
                    });
                });
              },
              err => {
                console.log('partners error', err);
              }
            );
    }
  },
  watch: {
    activeFilter() {
      this.fetchData();
    },
    roleFilter() {
      this.fetchData();
    }
  }
};
</script>
<style lang="scss" scoped>
.modal-form {
  .has-label::after {
    top: 43px !important;
  }
}
</style>
