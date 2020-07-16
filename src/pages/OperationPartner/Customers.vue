<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Clientes</h2>
      <div class="box-actions">
        <div class="input-post-icon search">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Procurar Cliente"
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
            @click="toogleFilters"
          >
            <i class="icon-icon-filter"></i>
          </a>
        </div>
      </div>
      <div class="filters" v-show="showFilters">
        <v-select
          :options="statuses"
          :reduce="op => op.code"
          v-model="filters.status"
          class="no-margin"
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
            <th>Nome</th>
            <th>E-mail / CPF</th>
            <th>Parceiro / Status</th>
            <th>Usuário</th>
            <th style="width:144px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>{{ item.name }}</td>
            <td>
              <div class="two-lines">
                <span>{{ item.email }}</span>
                <span class="blue">{{ item.cpf }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.operationPartnerName }}</span>
                <span class="blue">{{ item.statusName }}</span>
              </div>
            </td>
            <td>{{ item.adminUserName }}</td>
            <td>
              <div class="actions">
                <button
                  type="button"
                  :title="item.active ? 'Inativar' : 'Ativar'"
                  class="bt c-green"
                  v-show="item.status == 1 || item.status == 3"
                  @click.native="approve(item)"
                >
                  <i class="icon-icon-check"></i>
                </button>
                <button
                  v-show="item.status == 1"
                  @click.native="disapprove(item)"
                  type="button"
                  title="Editar"
                  class="bt c-red"
                >
                  <i class="icon-icon-times"></i>
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
  </div>
</template>
<script>
import { Select, Option } from 'element-ui';
import { Pagination } from 'src/components';
import operationPartnerService from '../../services/OperationPartner/operationPartnerService';
import paging from '../../mixins/paging';
export default {
  mixins: [paging],
  components: {
    Pagination,
    [Select.name]: Select,
    [Option.name]: Option
  },
  data() {
    return {
      internalName: 'Parceiros',
      sortField: 'name',
      formLoading: false,
      statuses: [
        { code: 1, label: 'Novos' },
        { code: 2, label: 'Aprovados' },
        { code: 3, label: 'Reprovados' },
        { code: 4, label: 'Cadastrados no site' }
      ]
    };
  },
  methods: {
    fetchData() {
      const self = this;
      const request = {
        page: self.$data.pagination.currentPage - 1,
        pageItems: self.$data.pagination.perPage,
        searchWord: self.searchQuery,
        sort: self.formatSortFieldParam,
        idOperation: self.$store.getters.currentUser.idOperation,
        status: self.filters.status,
        idOperationPartner: self.$store.getters.currentUser.idOperationPartner
      };
      this.$data.loading = true;
      operationPartnerService.findAllCustomers(request).then(
        response => {
          self.$data.tableData = response.data;
          self.savePageSettings(self, response.totalItems);
          self.$data.loading = false;
        },
        () => {
          self.$data.loading = false;
        }
      );
    },
    approve(row) {
      const self = this;
      operationPartnerService
        .changeCustomerStatus({ id: row.id, status: 2 })
        .then(
          () => {
            self.$notify({
              type: 'success',
              message: 'Cliente aprovado com sucesso!'
            });
            row.status = 2;
            row.statusName = 'aprovado';
          },
          err => {
            self.$notify({
              type: 'danger',
              message: err.message
            });
          }
        );
    },
    disapprove(row) {
      const self = this;
      operationPartnerService
        .changeCustomerStatus({ id: row.id, status: 3 })
        .then(
          () => {
            self.$notify({
              type: 'primary',
              message: 'Cliente reprovado com sucesso!'
            });
            row.status = 3;
            row.statusName = 'reprovado';
          },
          err => {
            self.$notify({
              type: 'primary',
              message: err.message
            });
          }
        );
    }
  },
  watch: {
    'filters.status'() {
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
