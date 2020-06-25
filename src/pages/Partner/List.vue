<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Parceiros</h2>
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
          to="/partner/new"
          class="bt bt-square bg-white-2 c-light-blue"
        >
          <i class="icon-icon-plus"></i>
        </base-link>
      </div>
      <div class="filters" v-show="showFilters">
        <v-select
          :options="types"
          :reduce="op => op.code"
          v-model="typeFilter"
          class="no-margin"
          placeholder="Filtre por tipo"
        >
          <span slot="no-options">Nenhum tipo encontrado</span>
        </v-select>
        <v-select
          :options="statuses"
          :reduce="op => op.code"
          v-model="activeFilter"
          placeholder="Filtre pelo Status"
        >
          <span slot="no-options">Nenhum status encontrado</span>
        </v-select>
      </div>
    </div>
    <div class="list-table">
      <table v-loading="loading">
        <thead>
          <tr>
            <th>Nome Parceiro</th>
            <th>Tipo Parceiro</th>
            <th>Usuário / Criação</th>
            <th>Usuário / Atualização</th>
            <th style="width:144px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td class="td-flex">
              <div class="img-holder-square">
                <img
                  v-if="item.logo && item.logo !== ''"
                  :src="item.logo"
                  :alt="item.name"
                />
                <span v-else>{{ item.name[0] }}</span>
              </div>
              <span>{{ item.name }}</span>
            </td>
            <td>
              <span>{{ item.type }}</span>
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
import partnerService from '../../services/Partner/partnerService';
import paging from '../../mixins/paging';

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
      internalName: 'Parceiro',
      sortField: 'name',
      activeFilter: '',
      typeFilter: '',
      showFilters: false,
      statuses: [
        { code: true, label: 'Ativos' },
        { code: false, label: 'Inativos' }
      ],
      types: [
        { code: 1, label: 'Benefícios' },
        { code: 2, label: 'Cursos Livres' }
      ]
    };
  },
  methods: {
    handleEdit(row) {
      this.$router.push(`/partner/${row.id}/edit/`);
    },
    toggleActive(row) {
      const self = this;
      partnerService.toggleActive(row.id).then(data => {
        if (data.status === 'ok') {
          row.active = data.data;
          self.$notify({
            type: 'success',
            message: `Parceiro ${
              row.active ? 'ativado' : 'inativado'
            } com sucesso`
          });
        }
      });
    },
    fetchData() {
      const self = this;
      const request = {
        page: this.$data.pagination.currentPage - 1,
        pageItems: this.$data.pagination.perPage,
        searchWord: this.searchQuery,
        sort: this.formatSortFieldParam,
        active: this.activeFilter,
        type: this.typeFilter,
        idParent: ''
      };
      this.$data.loading = true;
      partnerService.findAll(request).then(
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
            partnerService.delete(self.modal.model.id).then(
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
        this.resetModal();
      }
    },
    closeDeleteSuccess() {
      this.showSuccess(false);
    }
  },
  watch: {
    activeFilter() {
      this.pagination.currentPage = 1;
      this.fetchData();
    },
    typeFilter() {
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
