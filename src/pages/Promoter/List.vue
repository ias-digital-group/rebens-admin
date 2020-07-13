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
        <base-link
          to="/promoter/new"
          class="bt bt-square bg-white-2 c-light-blue"
        >
          <i class="icon-icon-plus"></i>
        </base-link>
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
            <th>CPF</th>
            <th>Email</th>
            <th>Data Criação</th>
            <th>Status</th>
            <th style="width:64px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>
              <span>{{ item.name }} {{ item.surname }}</span>
            </td>
            <td>
              <span>{{ item.cpf }}</span>
            </td>
            <td>
              <span>{{ item.email }}</span>
            </td>
            <td>
              <span>{{ item.created }}</span>
            </td>
            <td>
              <span>{{ item.statusName }}</span>
            </td>
            <td>
              <div class="actions">
                <button
                  @click="resendValidation(item.id)"
                  type="button"
                  title="Reenviar validação"
                  class="bt c-orange"
                >
                  <i class="icon-icon-send"></i>
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
import { Pagination, ConfirmModal } from 'src/components';
import promoterService from '../../services/Promoter/promoterService';
import paging from '../../mixins/paging';
export default {
  mixins: [paging],
  components: {
    Pagination,
    [Select.name]: Select,
    [Option.name]: Option,
    ConfirmModal
  },
  data() {
    return {
      internalName: 'Clientes',
      sortField: 'name',
      formLoading: false,
      resendPassId: 0,
      showResendPassModal: false,
      statuses: [
        { code: 1, label: 'Completo' },
        { code: 3, label: 'Validação' },
        { code: 5, label: 'Incompleto' }
      ]
    };
  },
  methods: {
    fetchData() {
      const self = this;
      const request = {
        page: this.$data.pagination.currentPage - 1,
        pageItems: this.$data.pagination.perPage,
        searchWord: this.searchQuery,
        sort: this.formatSortFieldParam,
        status: this.filters.status
      };
      this.$data.loading = true;
      promoterService.list(request).then(
        response => {
          self.$data.tableData = response.data;
          self.savePageSettings(self, response.totalItems, response.totalPages);
          self.$data.loading = false;
        },
        () => {
          self.$data.loading = false;
        }
      );
    },
    closeResendPassword() {
      this.resendPassId = 0;
      this.showResendPassModal = false;
    },
    confirmResendPassword() {
      const self = this;
      self.$data.loading = true;
      self.showResendPassModal = false;
      promoterService.resendValidation(self.resendPassId).then(
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
    resendValidation(id) {
      this.resendPassId = id;
      this.showResendPassModal = true;
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
