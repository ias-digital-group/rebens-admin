<template>
  <div class="list-box">
    <div class="page-header">
      <h2>{{ $t('pages.users.title') }}</h2>
      <div class="box-actions">
        <div class="input-post-icon search">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Digite aqui o que deseja encontrar"
          />
          <i v-if="searchQuery === ''" class="icon-icon-search"></i>
          <i
            v-else
            class="bt-clear-search icon-icon-times c-red"
            @click="searchQuery = ''"
          ></i>
        </div>
        <div class="filter" :class="{ active: showFilters }">
          <a
            class="bt bt-square bg-white-2 c-light-blue"
            @click="showFilters = !showFilters"
          >
            <i class="icon-icon-filter"></i>
          </a>
        </div>
        <base-link to="/users/new" class="bt bt-square bg-white-2 c-light-blue">
          <i class="icon-icon-plus"></i>
        </base-link>
      </div>
      <div class="filters" v-show="showFilters">
        <v-select
          :options="operations"
          :reduce="op => op.code"
          v-model="operationFilter"
          class="no-margin"
          placeholder="Filtre pelo Clube"
        >
          <span slot="no-options">Nenhum clube encontrado</span>
        </v-select>
        <v-select
          :options="operationPartners"
          :reduce="op => op.code"
          v-model="operationPartnerFilter"
          placeholder="Filtre por Empresa"
        >
          <span slot="no-options">Nenhuma empresa encontrada</span>
        </v-select>
        <v-select
          :options="roles"
          :reduce="op => op.code"
          v-model="roleFilter"
          v-show="isRebens"
          placeholder="Filtre pelo Papel"
        >
          <span slot="no-options">Nenhum papel encontrado</span>
        </v-select>
        <v-select
          :options="statuses"
          :reduce="op => op.code"
          v-model="activeFilter"
          placeholder="Filtre pelo Status"
        >
          <span slot="no-options">Nenhum status encontrado</span>
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
                <img
                  v-if="item.picture && item.picture !== ''"
                  :src="item.picture"
                  :alt="item.name"
                />
                <span v-else>{{ item.initials }}</span>
              </div>
              <div class="two-lines">
                <span>{{ item.name }} {{ item.surname }}</span>
                <span class="blue">{{ item.email }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.operation }}</span>
                <span class="blue">{{ item.operationPartner }}</span>
              </div>
            </td>
            <td>
              <span>{{ item.roleName }}</span>
            </td>
            <td>
              <div class="actions">
                <button
                  @click="toggleActive(item)"
                  type="button"
                  :title="item.active ? 'Inativar' : 'Ativar'"
                  class="bt"
                  :class="{
                    'c-green': item.active,
                    'c-light-gray': !item.active
                  }"
                >
                  <i class="icon-icon-check"></i>
                </button>
                <button
                  @click="handleResendPassword(item)"
                  type="button"
                  title="Reenviar validação"
                  class="bt c-orange"
                >
                  <i class="icon-icon-send"></i>
                </button>
                <button
                  @click="handleEdit(item)"
                  type="button"
                  title="Editar"
                  class="bt c-light-blue"
                >
                  <i class="icon-icon-edit"></i>
                </button>
                <button
                  @click="handleDelete(item)"
                  type="button"
                  title="apagar"
                  class="bt c-red"
                >
                  <i class="icon-icon-delete"></i>
                </button>
              </div>
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
      ></pagination>
    </div>
    <delete-modal
      @confirmDelete="confirmDelete"
      :itemName="modal.itemName"
      :show="modal.visible"
      :showSuccess="modal.showSuccess"
      @closeDeleteSuccess="closeDeleteSuccess"
    ></delete-modal>
    <confirm-modal
      @closeModal="closeResendPassword"
      question="Deseja reenviar o e-mail de validação?"
      :show="showResendPassModal"
      @confirm="confirmResendPassword"
    ></confirm-modal>
  </div>
</template>
<script>
import { Select, Option } from 'element-ui';
import { Pagination, DeleteModal, ConfirmModal } from 'src/components';
import userService from '../../services/User/userService';
import operationService from '../../services/Operation/operationService';
import operationPartnerService from '../../services/OperationPartner/operationPartnerService';
import paging from '../../mixins/paging';
import _ from 'lodash';

export default {
  mixins: [paging],
  components: {
    Pagination,
    [Select.name]: Select,
    [Option.name]: Option,
    DeleteModal,
    ConfirmModal
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
      resendPassId: 0,
      showResendPassModal: false,
      statuses: [
        { code: true, label: 'Ativos' },
        { code: false, label: 'Inativos' }
      ]
    };
  },
  methods: {
    handleEdit(row) {
      this.$router.push(`/users/${row.id}/edit/`);
    },
    toggleActive(row) {
      const self = this;
      userService.toggleActive(row.id).then(data => {
        if (data.status === 'ok') {
          row.active = data.data;
          self.$notify({
            type: 'success',
            message: `Usuário ${
              row.active ? 'ativado' : 'inativado'
            } com sucesso`
          });
        }
      });
    },
    confirmResendPassword() {
      const self = this;
      self.$data.loading = true;
      self.showResendPassModal = false;
      userService.resendValidation(self.resendPassId).then(
        () => {
          self.$notify({
            type: 'success',
            message: 'E-mail reenviado com sucesso!'
          });
          self.$data.loading = false;
          self.resendPassId = 0;
        },
        () => {
          self.$data.loading = false;
        }
      );
    },
    handleResendPassword(row) {
      this.resendPassId = row.id;
      this.showResendPassModal = true;
    },
    closeResendPassword() {
      this.resendPassId = 0;
      this.showResendPassModal = false;
    },
    fetchData() {
      const self = this;
      const request = {
        page: self.$data.pagination.currentPage - 1,
        pageItems: self.$data.pagination.perPage,
        searchWord: self.searchQuery,
        sort: self.formatSortFieldParam,
        active: self.activeFilter !== null ? self.activeFilter : '',
        role: self.roleFilter ? self.roleFilter : '',
        idOperation: self.operationFilter ? self.operationFilter : '',
        idOperationPartner: self.operationPartnerFilter
          ? self.operationPartnerFilter
          : ''
      };
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
      if (self.roles.length === 0) {
        self.populateFilters(self);
      }
    },
    handleDelete(item) {
      this.modal.model = item;
      this.modal.itemName = item.name + ' ' + item.surname;
      this.modal.visible = true;
    },
    confirmDelete(val) {
      const self = this;
      if (val) {
        userService.delete(self.modal.model.id).then(
          () => {
            self.resetModal();
            self.fetchData();
            self.showSuccess(true);
          },
          err => {
            self.$notify({
              type: 'danger',
              message: err.message
            });
          }
        );
      } else {
        this.resetModal();
      }
    },
    closeDeleteSuccess() {
      this.showSuccess(false);
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

      operationService.findAll().then(response => {
        _.each(response.data, function(el) {
          if (el.id != self.id) {
            self.operations.push({ code: el.id, label: el.title });
          }
        });
      });

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
      this.pagination.currentPage = 1;
      this.fetchData();
    },
    roleFilter() {
      this.pagination.currentPage = 1;
      this.fetchData();
    },
    operationFilter() {
      this.pagination.currentPage = 1;
      this.fetchData();
    },
    operationPartnerFilter() {
      this.pagination.currentPage = 1;
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
