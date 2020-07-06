<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Promotores</h2>
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
      </div>
    </div>
    <div class="list-table">
      <table v-loading="loading">
        <thead>
          <tr>
            <th>Nome / E-mail</th>
            <th>Validação</th>
            <th>Incompleto</th>
            <th>Completo</th>
            <th>Ativo</th>
            <th>Inativo</th>
            <th>Total</th>
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
                <span v-else>{{ item.name[0] }}</span>
              </div>
              <div class="two-lines">
                <span>{{ item.name }} {{ item.surname }}</span>
                <span class="blue">{{ item.email }}</span>
              </div>
            </td>
            <td>
              <span>{{ item.totalValidation }}</span>
            </td>
            <td>
              <span>{{ item.totalIncomplete }}</span>
            </td>
            <td>
              <span>{{ item.totalComplete }}</span>
            </td>
            <td>
              <span>{{ item.totalActive }}</span>
            </td>
            <td>
              <span>{{ item.totalInactive }}</span>
            </td>
            <td>
              <span>{{ item.total }}</span>
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
import promoterService from '../../services/Promoter/promoterService';
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
      internalName: 'Promotores',
      formLoading: false
    };
  },
  methods: {
    fetchData() {
      const self = this;
      const request = {
        page: this.$data.pagination.currentPage - 1,
        pageItems: this.$data.pagination.perPage,
        searchWord: this.searchQuery,
        sort: this.formatSortFieldParam
      };
      this.$data.loading = true;
      promoterService.report(request).then(
        response => {
          self.$data.tableData = response.data;
          if (response.data) {
            self.showTable = response.data.length > 0;
          } else {
            self.showTable = false;
          }
          self.savePageSettings(self, response.totalItems);
          self.$data.loading = false;
        },
        () => {
          self.$data.loading = false;
        }
      );
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
