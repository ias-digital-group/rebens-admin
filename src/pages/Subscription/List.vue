<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Assinaturas</h2>

      <div class="box-actions" style="padding-top:8px">
        <div class="input-post-icon search" style="margin-right:16px">
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
        <button
          type="button"
          @click="generateExcel"
          class="bt bt-square bg-white-2 c-light-blue"
        >
          <i class="icon-icon-download"></i>
        </button>
      </div>
    </div>
    <div class="list-table" v-loading="loading">
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Plano</th>
            <th>Valor</th>
            <th>Próxima cobrança</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>{{ item.code }}</td>
            <td>{{ item.customer.name }}</td>
            <td>{{ item.planName }}</td>
            <td>{{ item.amountString }}</td>
            <td>{{ item.nextInvoiceDateString }}</td>
            <td>{{ item.status }}</td>
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
    <a id="linkFile" :href="fileUrl" target="_blank"></a>
  </div>
</template>
<script>
import { Pagination } from 'src/components';
import wirecardService from '../../services/Wirecard/wirecardService';
import paging from '../../mixins/paging';
export default {
  mixins: [paging],
  components: {
    Pagination
  },
  data() {
    return {
      internalName: 'subscriptions',
      sortField: 'name',
      fileUrl: ''
    };
  },
  methods: {
    fetchData() {
      const self = this;
      const request = {
        page: self.$data.pagination.currentPage - 1,
        pageItems: self.$data.pagination.perPage,
        searchWord: self.searchQuery,
        idOperation: ''
      };
      self.loading = true;
      wirecardService.findAll(request).then(
        response => {
          self.$data.tableData = response.data;
          self.savePageSettings(self, response.totalItems);
          self.loading = false;
        },
        () => {
          self.loading = false;
        }
      );
    },
    generateExcel() {
      const self = this;
      const request = {
        searchWord: self.searchQuery,
        idOperation: ''
      };
      self.loading = true;
      wirecardService.generateExcel(request).then(
        response => {
          self.fileUrl = response.url;
          setTimeout(() => {
            document.getElementById('linkFile').click();
          }, 500);

          self.loading = false;
        },
        () => {
          self.loading = false;
        }
      );
    }
  }
};
</script>
