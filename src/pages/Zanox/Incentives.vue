<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Cupons Zanox</h2>
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
          :options="programs"
          :reduce="op => op.code"
          v-model="filters.program"
          class="no-margin"
          placeholder="Filtre pelo parceiro"
        >
          <span slot="no-options">Nenhum parceiro encontrado</span>
        </v-select>
      </div>
    </div>
    <div class="list-table" v-loading="loading">
      <table>
        <thead>
          <tr>
            <th>Programa</th>
            <th>Nome</th>
            <th>Inicio / Fim</th>
            <th>Valor / Código</th>
            <th>Status</th>
            <th style="width:30px;"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td class="td-flex">
              <div class="img-holder-square">
                <img
                  :src="item.programImage"
                  :alt="item.programName"
                  width="96"
                  height="40"
                />
              </div>
              <span>{{ item.programName }}</span>
            </td>
            <td>
              <span>{{ item.name }}</span>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.start }}</span>
                <span class="blue">{{ item.end }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.amount }}</span>
                <span class="blue">{{ item.code }}</span>
              </div>
            </td>
            <td>{{ item.active ? 'Ativo' : 'Inativo' }}</td>
            <td>
              <a
                type="button"
                title="visualizar"
                class="bt c-orange"
                target="_blank"
                v-if="item.url !== ''"
                :href="item.url"
                style="padding:0;"
              >
                <i class="icon-icon-view"></i>
              </a>
              <span
                v-else
                class="bt c-orange cursor-block"
                title="visualizar"
                style="padding:0;"
              >
                <i class="icon-icon-view"></i>
              </span>
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
import zanoxService from '../../services/Zanox/zanoxService';
import { Select, Option } from 'element-ui';
import { Pagination } from 'src/components';
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
      internalName: 'pages.zanoxProgram.incentives',
      programs: []
    };
  },
  methods: {
    fetchData() {
      const self = this;
      const request = {
        page: self.$data.pagination.currentPage - 1,
        pageItems: self.$data.pagination.perPage,
        searchWord: self.searchQuery,
        program: self.filters.program
      };
      self.loading = true;
      zanoxService.findAllIncentives(request).then(
        response => {
          self.$data.tableData = response.data;
          self.savePageSettings(self, response.totalItems, response.totalPages);
          self.loading = false;
        },
        () => {
          self.loading = false;
        }
      );
    },
    loadPrograms() {
      const self = this;
      self.programs = [];
      zanoxService.findAll({ page: 0, pageItems: 99999, searchWord: '' }).then(
        response => {
          _.each(response.data, function(el) {
            if (el.id != self.id) {
              self.programs.push({ code: el.id, label: el.name });
            }
          });
        },
        () => {
          self.loading = false;
        }
      );
    }
  },
  watch: {
    'filters.program'() {
      this.pagination.currentPage = 1;
      this.fetchData();
    }
  },
  created() {
    this.loadPrograms();
  }
};
</script>
