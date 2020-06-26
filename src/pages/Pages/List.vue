<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Páginas</h2>
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
      </div>
    </div>
    <div class="list-table">
      <table v-loading="loading">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Operação</th>
            <th style="width:144px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>
              <span>{{ item.name }}</span>
            </td>
            <td>
              <span>{{ item.operationName }}</span>
            </td>
            <td>
              <div class="actions">
                <button
                  @click="handleEdit(item)"
                  type="button"
                  title="Editar"
                  class="bt c-light-blue"
                >
                  <i class="icon-icon-edit"></i>
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
import { Pagination, Modal } from 'src/components';
import operationService from '../../services/Operation/operationService';
import staticTextService from '../../services/StaticText/staticTextService';
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
      internalName: 'pages.pages.list',
      sortField: 'name',
      operations: [],
      operationFilter: '',
      showFilters: false
    };
  },
  methods: {
    handleEdit(row) {
      this.$router.push(`/pages/${row.id}/edit/`);
    },
    fetchData() {
      const self = this;
      const request = {
        page: this.$data.pagination.currentPage - 1,
        pageItems: this.$data.pagination.perPage,
        searchWord: this.searchQuery,
        sort: this.formatSortFieldParam,
        idStaticTextType: 4,
        idOperation: this.operationFilter
      };
      this.$data.loading = true;
      staticTextService.findAll(request).then(
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
    loadOperations() {
      const self = this;
      if (!self.operations || self.operations.length === 0) {
        self.operations = [];
        operationService.findAll().then(response => {
          _.each(response.data, function(el) {
            if (el.id != self.id) {
              self.operations.push({ code: el.id, label: el.title });
            }
          });
        });
      }
    }
  },
  watch: {
    operationFilter() {
      this.pagination.currentPage = 1;
      this.fetchData();
    }
  },
  created() {
    this.loadOperations();
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
