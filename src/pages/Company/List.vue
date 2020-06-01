<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Empresas</h2>
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
        <base-link to="/company/new" class="bt bt-square bg-white-2 c-light-blue">
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
            <th>Nome / Endereço</th>
            <th>Responsável / E-mail</th>
            <th>Cargo / Telefone</th>
            <th>Tel. Comercial / Celular</th>
            <th style="width:144px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>
              <div class="two-lines">
                <span>{{ item.itemName }}</span>
                <span class="blue">{{ item.address.name }}</span>
              </div>
            </td>
            <td></td>
            <td>
              <div class="two-lines">
                <span>{{ item.contact.name }}</span>
                <span class="blue">{{ item.contact.email }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.contact.jobTitle }}</span>
                <span class="blue">{{ item.contact.phone }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.contact.comercialPhone }}</span>
                <span class="blue">{{ item.contact.cellPhone }}</span>
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
    <delete-modal @confirmDelete="confirmDelete" :itemName="modal.itemName" :show="modal.visible"></delete-modal>
  </div>
</template>
<script>
import { Select, Option } from 'element-ui';
import { Pagination, DeleteModal } from 'src/components';
import companyService from '../../services/Company/companyService';
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
      internalName: 'Empresa',
      sortField: 'name',
      activeFilter: '',
      typeFilter: '',
      showFilters: false,
      statuses: [
        { code: true, label: 'Ativos' },
        { code: false, label: 'Inativos' }
      ],
      types: [
        { code: 22, label: 'Operação' },
        { code: 23, label: 'Parceiro' }
      ]
    };
  },
  methods: {
    handleEdit(row) {
      this.$router.push(`/company/${row.id}/edit/`);
    },
    toggleActive(row) {
      const self = this;
      companyService.toggleActive(row.id).then(data => {
        if (data.status === 'ok') {
          row.active = data.data;
          self.$notify({
            type: 'success',
            message: `Empresa ${
              row.active ? 'ativada' : 'inativada'
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
        idOperation: '',
        idPartner: ''
      };
      this.$data.loading = true;
      companyService.findAll(request).then(
        response => {
          self.$data.tableData = response.data;
          self.savePageSettings(self, response.totalItems, response.totalPages);
          self.$data.loading = false;
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
            companyService.delete(self.modal.model.id).then(
              response => {
                self.$notify({
                  type: 'success',
                  message: response.message
                });
                self.resetModal();
                self.pagination.currentPage = 1;
                self.fetchData();
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
