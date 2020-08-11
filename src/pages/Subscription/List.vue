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
          :options="statuses"
          :reduce="op => op.code"
          v-model="filters.status"
          class="no-margin"
          placeholder="Filtre pelo Status"
        >
          <span slot="no-options">Nenhum status encontrado</span>
        </v-select>
        <v-select
          :options="plans"
          :reduce="op => op.code"
          v-model="filters.plan"
          placeholder="Filtre por plano"
        >
          <span slot="no-options">Nenhum plano encontrado</span>
        </v-select>
      </div>
    </div>
    <div class="list-table" v-loading="loading">
      <table>
        <thead>
          <tr>
            <th>Cliente / CPF</th>
            <th>Plano / Clube</th>
            <th>Forma de pagamento / Data</th>
            <th>Próxima cobrança</th>
            <th>Valor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>
              <div class="two-lines">
                <span
                  >{{ item.customer.name }} {{ item.customer.surname }}</span
                >
                <span class="blue">{{ item.customer.cpf }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.planName }}</span>
                <span class="blue">{{ item.customer.cpf }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.paymentMethod }}</span>
                <span class="blue">{{ item.creationDateString }}</span>
              </div>
            </td>
            <td>{{ item.nextInvoiceDateString }}</td>
            <td>{{ item.amountString }}</td>
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
      fileUrl: '',
      statuses: [
        { code: 'ACTIVE', label: 'Ativa' },
        { code: 'SUSPENDED', label: 'Suspensa' },
        { code: 'EXPIRED', label: 'Expirada' },
        { code: 'OVERDUE', label: 'Atrasada' },
        { code: 'CANCELED', label: 'Cancelada' },
        { code: 'TRIAL', label: 'Teste' }
      ],
      plans: [
        { code: 'MENSAL', label: 'Mensal' },
        { code: 'XPTOA', label: 'Anual' },
        { code: 'XPTOM', label: 'Mensal antigo' },
        { code: 'XPTOT1', label: 'Trimestral' }
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
        idOperation: '',
        plan: self.filters.plan,
        status: self.filters.status
      };
      self.loading = true;
      ~wirecardService.findAll(request).then(
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
  },
  watch: {
    'filters.plan'() {
      this.pagination.currentPage = 1;
      this.fetchData();
    },
    'filters.status'() {
      this.pagination.currentPage = 1;
      this.fetchData();
    }
  }
};
</script>
