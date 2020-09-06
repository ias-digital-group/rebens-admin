<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Raspadinhas</h2>
      <div class="box-actions">
        <div class="input-post-icon search">
          <input type="text" v-model="searchQuery" placeholder="Digite aqui o que deseja encontrar" />
          <i v-if="searchQuery === ''" class="icon-icon-search"></i>
          <i v-else class="bt-clear-search icon-icon-times c-red" @click="searchQuery = ''"></i>
        </div>
        <div class="filter" :class="{ active: showFilters }">
          <a class="bt bt-square bg-white-2 c-light-blue" @click="showFilters = !showFilters">
            <i class="icon-icon-filter"></i>
          </a>
        </div>
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
          :options="campaigns"
          :reduce="op => op.code"
          v-model="filters.status"
          placeholder="Filtre pela Campanha"
        >
          <span slot="no-options">Nenhuma campanha encontrada</span>
        </v-select>
      </div>
    </div>
    <div class="list-table" v-loading="loading">
      <table>
        <thead>
          <tr>
            <th>Campanha / Clube</th>
            <th>Cliente / Geração</th>
            <th>Código / Validação</th>
            <th>Prêmio</th>
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
                <span>{{ item.customerName }}</span>
                <span class="blue">{{ item.date }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.validationCode }}</span>
                <span class="blue">{{ item.validationDate }}</span>
              </div>
            </td>
            <td>{{item.Prize}}</td>
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
import scratchcardService from '../../services/Scratchcard/scratchcardService';
import scratchcardDrawService from '../../services/Scratchcard/scratchcardDrawService';
import paging from '../../mixins/paging';
import _ from 'lodash';

export default {
  mixins: [paging],
  components: {
    Pagination,
    [Select.name]: Select,
    [Option.name]: Option,
  },
  data() {
    return {
      internalName: 'billets',
      sortField: 'name',
      operations: [],
      showFilters: false,
      campaigns: [],
    };
  },
  methods: {
    fetchData() {
      const self = this;
      const request = {
        page: self.$data.pagination.currentPage - 1,
        pageItems: self.$data.pagination.perPage,
        searchWord: self.searchQuery,
        idOperation: self.filters.operation,
        idScratchcard: self.filters.scratchcard,
      };
      this.$data.loading = true;
      scratchcardDrawService.list(request).then(
        (response) => {
          self.$data.tableData = response.data;
          self.savePageSettings(self, response.totalItems);
          self.$data.loading = false;
        },
        () => {
          self.$data.loading = false;
        }
      );
      if (self.operations.length <= 0) self.loadOperations();
      if (self.campaigns.length <= 0) self.loadCampaigns();
    },
    loadOperations() {
      const self = this;
      if (!self.operations || self.operations.length === 0) {
        self.operations = [];
        operationService.findAll().then((response) => {
          _.each(response.data, function (el) {
            if (el.id != self.id) {
              self.operations.push({ code: el.id, label: el.title });
            }
          });
        });
      }
    },
    loadCampaigns() {
      const self = this;
      if (!self.campaigns || self.campaigns.length === 0) {
        self.campaigns = [];
        const request = {
          page: 0,
          pageItems: 999,
          searchWord: '',
          status: null,
          idOperation: self.filters.operation,
        };
        scratchcardService.findAll().then((response) => {
          _.each(response.data, function (el) {
            if (el.id != self.id) {
              self.campaigns.push({ code: el.id, label: el.name });
            }
          });
        });
      }
    },
  },
  watch: {
    'filters.campaign'() {
      this.pagination.currentPage = 1;
      this.fetchData();
    },
    'filters.operation'() {
      this.pagination.currentPage = 1;
      this.campaigns = [];
      this.fetchData();
    },
  },
};
</script>
<style lang="scss" scoped>
.modal-form {
  .has-label::after {
    top: 43px !important;
  }
}
</style>
