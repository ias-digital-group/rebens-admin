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
          <i class="icon-icon-search"></i>
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
import { Select, Option } from 'element-ui';
import { Modal, Pagination } from 'src/components';
import userService from '../../services/User/userService';
import operationService from '../../services/Operation/operationService';
import operationPartnerService from '../../services/OperationPartner/operationPartnerService';
import paging from '../../mixins/paging';
import _ from 'lodash';

export default {
  mixins: [paging],
  components: {
    Modal,
    Pagination,
    [Select.name]: Select,
    [Option.name]: Option
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
    handleResendPassword(row) {
      if (confirm('Deseja reenviar o e-mail de validação?')) {
        const self = this;
        self.$data.loading = true;
        userService.resendValidation(row.id).then(
          () => {
            self.$notify({
              type: 'success',
              message: 'E-mail reenviado com sucesso!'
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
    validateModal() {
      const self = this;
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          self.modal.formLoading = true;
          userService.delete(self.modal.model.id).then(
            response => {
              self.$notify({
                type: 'success',
                message: response.message
              });
              self.resetModal();
              self.pagination.currentPage = 1;
              self.fetchData();
            },
            err => {
              self.$notify({
                type: 'danger',
                message: err.message
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
      this.fetchData();
    },
    roleFilter() {
      this.fetchData();
    },
    operationFilter() {
      this.fetchData();
    },
    operationPartnerFilter() {
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
