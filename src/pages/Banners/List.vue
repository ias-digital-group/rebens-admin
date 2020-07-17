<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Banners</h2>
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
          to="/banners/new"
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
          v-show="isRebens"
        >
          <span slot="no-options">Nenhum clube encontrado</span>
        </v-select>
        <v-select
          :options="types"
          :reduce="op => op.code"
          v-model="filters.type"
          placeholder="Filtre por tipo"
          :class="{ 'no-margin': !isRebens }"
        >
          <span slot="no-options">Nenhum tipo encontrado</span>
        </v-select>
        <v-select
          :options="statuses"
          :reduce="op => op.code"
          v-model="filters.active"
          placeholder="Filtre pelo Status"
        >
          <span slot="no-options">Nenhum status encontrado</span>
        </v-select>
        <v-select
          :options="places"
          :reduce="op => op.code"
          v-model="filters.place"
          placeholder="Filtre pelo lugar"
        >
          <span slot="no-options">Nenhum lugar encontrado</span>
        </v-select>
      </div>
    </div>
    <div class="list-table" v-loading="loading">
      <table>
        <thead>
          <tr>
            <th>Banner</th>
            <th>Nome Banner / Clube</th>
            <th>Tipo / Onde</th>
            <th>Ordem</th>
            <th>Usuário / Criação</th>
            <th>Usuário / Atualização</th>
            <th style="width:144px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>
              <div class="img-holder">
                <img
                  :src="item.image"
                  :alt="item.name"
                  width="96"
                  height="40"
                />
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.name }}</span>
                <span class="blue">{{ item.operationName }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.type }}</span>
                <span class="blue">{{ item.bannerShow }}</span>
              </div>
            </td>
            <td>
              <span>{{ item.order }}</span>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.createdUserName }}</span>
                <span class="blue">{{ item.created }}</span>
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
                <button
                  @click="handleDelete(item)"
                  type="button"
                  title="apagar"
                  class="bt c-red"
                >
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
</template>
<script>
import { Select, Option } from 'element-ui';
import { Pagination, DeleteModal } from 'src/components';
import operationService from '../../services/Operation/operationService';
import bannerService from '../../services/Banner/bannerService';
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
      internalName: 'pages.banners.list',
      sortField: 'name',
      operations: [],
      showFilters: false,
      places: [
        { code: 'H', label: 'Home' },
        { code: 'HL', label: 'Home Logada' },
        { code: 'HB', label: 'Home Benefícios' }
      ],
      statuses: [
        { code: true, label: 'Ativos' },
        { code: false, label: 'Inativos' }
      ],
      types: [
        { code: 1, label: 'Banner Full' },
        { code: 3, label: 'Imperdíveis' }
      ]
    };
  },
  methods: {
    handleEdit(row) {
      this.$router.push(`/banners/${row.id}/edit/`);
    },
    toggleActive(row) {
      const self = this;
      self.loading = true;
      bannerService.toggleActive(row.id).then(data => {
        if (data.status === 'ok') {
          row.active = data.data;
          self.loading = false;
          self.$notify({
            type: 'success',
            message: `Banner ${
              row.active ? 'ativado' : 'inativado'
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
        searchWord: self.searchQuery,
        sort: self.formatSortFieldParam,
        active: self.filters.active,
        type: self.filters.type,
        idOperation: self.filters.operation,
        where: self.filters.place
      };
      self.loading = true;
      bannerService.findAll(request).then(
        response => {
          self.$data.tableData = response.data;
          self.savePageSettings(self, response.totalItems, response.totalPages);
          self.loading = false;
        },
        () => {
          self.loading = false;
        }
      );

      self.loadOperations();
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
    },
    handleDelete(item) {
      this.modal.model = item;
      this.modal.itemName = item.name;
      this.modal.visible = true;
    },
    confirmDelete(val) {
      const self = this;
      if (val) {
        this.$validator.validateAll().then(isValid => {
          if (isValid) {
            self.modal.formLoading = true;
            bannerService.delete(self.modal.model.id).then(
              () => {
                self.resetModal();
                self.fetchData();
                self.showSuccess(true);
              },
              err => {
                if (err.response.status === 400 && err.response.data.message) {
                  self.$notify({
                    type: 'warning',
                    message: err.response.data.message
                  });
                } else {
                  self.$notify({
                    type: 'danger',
                    message: err.message
                  });
                }
                self.modal.formLoading = false;
              }
            );
          }
        });
      } else {
        self.resetModal();
      }
    },
    closeDeleteSuccess() {
      this.showSuccess(false);
    }
  },
  watch: {
    'filters.active'() {
      this.pagination.currentPage = 1;
      this.fetchData();
    },
    'filters.type'() {
      this.pagination.currentPage = 1;
      this.fetchData();
    },
    'filters.operation'() {
      this.pagination.currentPage = 1;
      this.fetchData();
    },
    'filters.place'() {
      this.pagination.currentPage = 1;
      this.fetchData();
    }
  },
  created() {
    this.isRebens =
      this.$store.getters.currentUser.role != 'administrator' &&
      this.$store.getters.currentUser.role != 'publisher';
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
