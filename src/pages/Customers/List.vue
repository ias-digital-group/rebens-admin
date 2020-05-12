<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Clientes</h2>
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
        <base-link
          to="/customers/new"
          class="bt bt-square bg-white-2 c-light-blue"
        >
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
          placeholder="Filtre por empresa"
        >
          <span slot="no-options">Nenhuma empresa encontrada</span>
        </v-select>
        <v-select
          :options="statuses"
          :reduce="op => op.code"
          v-model="activeFilter"
          placeholder="Filtre pelo Status de cadastro"
        >
          <span slot="no-options">Nenhum status de cadastro encontrado</span>
        </v-select>
        <v-select
          :options="activeOpts"
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
            <th>CPF</th>
            <th>Clube / Empresa</th>
            <th>Telefone / Celular</th>
            <th style="width:192px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>
              <div class="two-lines">
                <span>{{ item.fullname }}</span>
                <span class="blue">{{ item.email }}</span>
              </div>
            </td>
            <td>
              <span>{{ item.cpf }}</span>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.operation }}</span>
                <span class="blue">{{ item.operationPartner }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.phone }}</span>
                <span class="blue">{{ item.cellphone }}</span>
              </div>
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
    <!-- Classic Modal -->
    <modal :show.sync="modal.visible" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Remover Pré-cadastro</h4>
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
import { Pagination, Modal } from 'src/components';
import customerService from '../../services/Customer/customerService';
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
      internalName: 'Clientes',
      sortField: 'name',
      operationFilter: '',
      operationPartnerFilter: '',
      showFilters: false,
      activeFilter: '',
      statusFilter: '',
      operations: [],
      operationPartners: [],
      statuses: [
        { code: 1, label: 'Completo' },
        { code: 3, label: 'Validação' },
        { code: 4, label: 'Validação' },
        { code: 5, label: 'Incompleto' },
        { code: 6, label: 'Pré-cadastro' }
      ],
      activeOpts: [
        { code: true, label: 'Ativos' },
        { code: false, label: 'Inativos' }
      ],
      formLoading: false
    };
  },
  methods: {
    handleEdit(row) {
      this.$router.push(`/customers/${row.id}/edit/`);
    },
    toggleActive(row) {
      const self = this;
      customerService.toggleActive(row.id).then(data => {
        if (data.status === 'ok') {
          row.active = data.data;
          self.$notify({
            type: 'success',
            message: `Cliente ${
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
        customerService.resendValidation(row.id).then(
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
        status: self.statusFilter !== null ? self.statusFilter : '',
        active: self.activeFilter !== null ? self.activeFilter : '',
        idOperation: self.operationFilter ? self.operationFilter : '',
        idOperationPartner: self.operationPartnerFilter
          ? self.operationPartnerFilter
          : ''
      };
      this.$data.loading = true;
      customerService.findAll(request).then(
        response => {
          self.$data.tableData = response.data;
          self.savePageSettings(self, response.totalItems, response.totalPages);
          self.$data.loading = false;
        },
        () => {
          self.$data.loading = false;
        }
      );
      self.populateFilters(self);
    },
    populateFilters(self) {
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
    },
    validateModal() {
      const self = this;
      this.$validator.validateAll('modalScope').then(isValid => {
        if (isValid) {
          self.modal.formLoading = true;
          operationService
            .deleteCustomer(
              self.$store.getters.currentUser.idOperation,
              self.modal.model.id
            )
            .then(
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
    }
  },
  watch: {
    activeFilter() {
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
