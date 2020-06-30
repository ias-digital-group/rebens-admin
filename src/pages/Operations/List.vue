<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Operações</h2>
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
        <base-link to="/operations/new" class="bt bt-square bg-white-2 c-light-blue">
          <i class="icon-icon-plus"></i>
        </base-link>
      </div>
      <div class="filters" v-show="showFilters">
        <v-select
          :options="statuses"
          :reduce="op => op.code"
          v-model="activeFilter"
          placeholder="Filtre pelo Status"
        >
          <span slot="no-options">Nenhum status encontrado</span>
        </v-select>
      </div>
      <div class="list-table">
        <table v-loading="loading">
          <thead>
            <tr>
              <th>Nome do clube</th>
              <th>Usuário / Criação</th>
              <th>Usuário / Publicação</th>
              <th>Usuário / Atualização</th>
              <th style="width:144px;">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in tableData" :key="item.id">
              <td class="td-flex">
                <div class="img-holder">
                  <img v-if="item.image && item.image !== ''" :src="item.image" :alt="item.title" />
                  <span v-else>{{ item.title[0] }}</span>
                </div>
                <span>{{ item.title }}</span>
              </td>
              <td>
                <div class="two-lines">
                  <span>{{ item.createdUserName }}</span>
                  <span class="blue">{{ item.created }}</span>
                </div>
              </td>
              <td>
                <div class="two-lines">
                  <span>{{ item.publishedUserName }}</span>
                  <span class="blue">{{ item.publishedDate }}</span>
                </div>
              </td>
              <td>
                <div class="two-lines">
                  <span>{{ item.modifiedUserName }}</span>
                  <span class="blue">{{ item.modified }}</span>
                </div>
              </td>
              <td>
                <div class="actions">
                  <button
                    @click="toggleActive(item)"
                    type="button"
                    :title="item.active ? 'Inativar' : 'Ativar'"
                    class="bt"
                    :class="{
                    'c-green': item.active,
                    'c-light-gray': !item.active
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
                  <button @click="handleDelete(item)" type="button" title="apagar" class="bt c-red">
                    <i class="icon-icon-delete"></i>
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
      <delete-modal
        @confirmDelete="confirmDelete"
        :itemName="modal.itemName"
        :show="modal.visible"
        :showSuccess="modal.showSuccess"
        @closeDeleteSuccess="closeDeleteSuccess"
      ></delete-modal>
    </div>
  </div>
</template>
<script>
import { Select, Option } from 'element-ui';
import { Pagination, DeleteModal } from 'src/components';
import operationService from '../../services/Operation/operationService';
import paging from '../../mixins/paging';
import _ from 'lodash';

export default {
  mixins: [paging],
  components: {
    DeleteModal,
    Pagination,
    [Select.name]: Select,
    [Option.name]: Option
  },
  data() {
    return {
      internalName: 'pages.operations.list',
      sortField: 'name',
      isMaster: false,
      activeFilter: '',
      statuses: [
        { code: true, label: 'Ativos' },
        { code: false, label: 'Inativos' }
      ]
    };
  },
  methods: {
    handleEdit(index, row) {
      this.$router.push(`/operations/${row.id}/edit/`);
    },
    fetchData() {
      const self = this;
      const request = {
        page: this.$data.pagination.currentPage - 1,
        pageItems: this.$data.pagination.perPage,
        searchWord: this.searchQuery,
        sort: this.formatSortFieldParam,
        active: this.activeFilter
      };
      this.$data.loading = true;
      operationService.findAll(request).then(
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
    validateModal() {
      const self = this;
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          self.modal.formLoading = true;
          operationService.delete(self.modal.model.id).then(
            response => {
              self.$notify({
                type: 'primary',
                message: response.message,
                icon: 'tim-icons icon-bell-55'
              });
              self.resetModal();
              self.pagination.currentPage = 1;
              self.fetchData();
            },
            err => {
              self.$notify({
                type: 'primary',
                message: err.message,
                icon: 'tim-icons icon-bell-55'
              });
              self.modal.formLoading = false;
            }
          );
        }
      });
    }
  },
  created() {
    this.isMaster = this.$store.getters.currentUser.role == 'master';
    this.fetchData();
  },
  watch: {
    activeFilter() {
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
