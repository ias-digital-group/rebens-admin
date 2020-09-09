<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Prêmios</h2>
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
          to="/scratchcard/prizes/new"
          class="bt bt-square bg-white-2 c-light-blue"
        >
          <i class="icon-icon-plus"></i>
        </base-link>
      </div>
      <div class="filters" v-show="showFilters">
        <v-select
          :options="operations"
          :reduce="op => op.code"
          v-model="filters.operation"
          class="no-margin"
          placeholder="Filtre pelo Clube"
        >
          <span slot="no-options">Nenhum clube encontrado</span>
        </v-select>
        <v-select
          :options="scratchcards"
          :reduce="op => op.code"
          v-model="filters.scratchcard"
          placeholder="Filtre pela Campanha"
        >
          <span slot="no-options">Nenhuma Campanha encontrada</span>
        </v-select>
      </div>
    </div>
    <div class="list-table" v-loading="loading">
      <table>
        <thead>
          <tr>
            <th>Campanha / Clube</th>
            <th>Prêmio / Quantidade</th>
            <th>Usuário / Criação</th>
            <th style="width:144px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>
              <div class="two-lines">
                <span>{{ item.campaignName }}</span>
                <span class="blue">{{ item.operationName }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.prize }}</span>
                <span class="blue">{{ item.quantity }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.createdBy }}</span>
                <span class="blue">{{ item.created }}</span>
              </div>
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
import { Pagination } from 'src/components';
import operationService from '../../services/Operation/operationService';
import scratchcardPrizeService from '../../services/Scratchcard/scratchcardPrizeService';
import scratchcardService from '../../services/Scratchcard/scratchcardService';
import paging from '../../mixins/paging';
import _ from 'lodash';

export default {
  mixins: [paging],
  components: {
    Pagination,
    [Select.name]: Select,
    [Option.name]: Option
  },
  data() {
    return {
      internalName: 'premios',
      sortField: 'name',
      operations: [],
      showFilters: false,
      scratchcards: []
    };
  },
  methods: {
    handleEdit(row) {
      this.$router.push(`/scratchcard/prizes/${row.id}/edit/`);
    },
    fetchData() {
      const self = this;
      const request = {
        page: self.$data.pagination.currentPage - 1,
        pageItems: self.$data.pagination.perPage,
        searchWord: self.searchQuery,
        idScratchcard: self.filters.scratchcard,
        idOperation: self.filters.operation
      };
      this.$data.loading = true;
      scratchcardPrizeService.list(request).then(
        response => {
          self.$data.tableData = response.data;
          self.savePageSettings(self, response.totalItems, response.totalPages);
          self.$data.loading = false;
        },
        () => {
          self.$data.loading = false;
        }
      );

      if (self.operations.length <= 0) self.loadOperations();
      if (self.scratchcards.length <= 0) self.loadCampaigns();
    },
    loadOperations() {
      const self = this;
      if (!self.operations || self.operations.length === 0) {
        self.operations = [];
        operationService.findAll().then(response => {
          _.each(response.data, function(el) {
              self.operations.push({ code: el.id, label: el.title });
          });
        });
      }
    },
    loadCampaigns() {
      const self = this;
      if (!self.scratchcards || self.scratchcards.length === 0) {
        self.scratchcards = [];
        scratchcardService.list({
            page: 0,
            pageItems: 999,
            searchWord: '',
            sort: 'name ASC',
            status: '',
            idOperation: self.filters.operation
          }).then(response => {
          _.each(response.data, function(el) {
              self.scratchcards.push({ code: el.id, label: el.name });
          });
        });
      }
    }
  },
  watch: {
    'filters.operation'() {
      this.pagination.currentPage = 1;
      this.scratchcards = [];
      this.fetchData();
    },
    'filters.scratchcard'() {
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
