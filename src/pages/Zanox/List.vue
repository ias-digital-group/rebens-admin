<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Parceiros Zanox</h2>
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
    <div class="list-table" v-loading="loading">
      <table>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Programa</th>
            <th>Inicio</th>
            <th>Status / Rank</th>
            <th style="width:64px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>
              <div class="img-holder-square">
                <img
                  :src="item.image"
                  :alt="item.name"
                  width="96"
                  height="40"
                />
              </div>
            </td>
            <td>
              <span>{{ item.name }}</span>
            </td>
            <td>
              <span>{{ item.startDate }}</span>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.status }}</span>
                <span class="blue">{{ item.adRank }}</span>
              </div>
            </td>
            <td>
              <div class="actions">
                <button
                  @click="togglePublish(item)"
                  type="button"
                  :title="item.published ? 'Inativar' : 'Ativar'"
                  class="bt"
                  :class="{
                    'c-green': item.published,
                    'c-light-gray': !item.published
                  }"
                >
                  <i class="icon-icon-check"></i>
                </button>
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
import zanoxService from '../../services/Zanox/zanoxService';
import { Pagination } from 'src/components';
import paging from '../../mixins/paging';

export default {
  mixins: [paging],
  components: {
    Pagination
  },
  data() {
    return {
      internalName: 'pages.zanoxProgram.list'
    };
  },
  methods: {
    handleEdit(row) {
      this.$router.push(`/zanox/${row.id}/edit/`);
    },
    togglePublish(row) {
      const self = this;
      self.loading = true;
      zanoxService.togglePublish(row.id).then(data => {
        if (data.status === 'ok') {
          row.published = data.data;
          self.loading = false;
          self.$notify({
            type: 'success',
            message: `Programa ${
              row.published ? 'publicado' : 'inativado'
            } com sucesso`
          });
        }
      });
    },
    fetchData() {
      const self = this;
      const request = {
        page: self.$data.pagination.currentPage - 1,
        pageItems: self.$data.pagination.perPage,
        searchWord: self.searchQuery
      };
      self.loading = true;
      zanoxService.findAll(request).then(
        response => {
          self.$data.tableData = response.data;
          self.savePageSettings(self, response.totalItems, response.totalPages);
          self.loading = false;
        },
        () => {
          self.loading = false;
        }
      );
    }
  },
  created() {
    this.fetchData();
  }
};
</script>
<style scoped>
table tr td,
table tr th {
  padding: 0 5px !important;
}
</style>
