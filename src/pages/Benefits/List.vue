<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Benefícios</h2>
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
          to="/benefits/new"
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
            <th>Título / Chamada</th>
            <th>Tipo / Validade</th>
            <th>Início / Término</th>
            <th style="width:144px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td class="td-flex">
              <div class="img-holder-square">
                <img
                  v-if="item.partnerImage && item.partnerImage !== ''"
                  :src="item.partnerImage"
                  :alt="item.partnerName"
                />
                <span v-else>{{ item.partnerName[0] }}</span>
              </div>
              <span>{{ item.partnerName }}</span>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.title }}</span>
                <span class="blue">{{ item.benefitCall }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.benefitType }}</span>
                <span class="blue">{{ formatDate(item.dueDate) }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ formatDate(item.start) }}</span>
                <span class="blue">{{ formatDate(item.end) }}</span>
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
                  @click="duplicate(item)"
                  type="button"
                  title="Duplicar"
                  class="bt c-green"
                >
                  <i class="icon-icon-duplicate"></i>
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
      ></pagination>
    </div>
    <delete-modal
      @confirmDelete="confirmDelete"
      :itemName="modal.itemName"
      :show="modal.visible"
    ></delete-modal>
  </div>
</template>
<script>
import { Select, Option } from 'element-ui';
import { Pagination, DeleteModal } from 'src/components';
import benefitService from '../../services/Benefit/benefitService';
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
      internalName: 'pages.benefits.list',
      sortField: 'name',
      activeFilter: '',
      typeFilter: '',
      operationFilter: '',
      showFilters: false,
      statuses: [
        { code: true, label: 'Ativos' },
        { code: false, label: 'Inativos' }
      ],
      types: [
        { code: 1, label: 'E-commerce' },
        { code: 2, label: 'Varejo Local' },
        { code: 3, label: 'Cashback' }
      ]
    };
  },
  methods: {
    formatDate(date) {
      if (date) {
        var dt = new Date(date);
        return (
          (dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate()) +
          '/' +
          (dt.getMonth() + 1 < 10
            ? '0' + (dt.getMonth() + 1)
            : dt.getMonth() + 1) +
          '/' +
          dt.getFullYear()
        );
      }
      return '';
    },
    handleDelete(item) {
      this.modal.model = item;
      this.modal.itemName = item.name;
      this.modal.visible = true;
    },
    handleEdit(row) {
      this.$router.push(`/benefits/${row.id}/edit/`);
    },
    duplicate(row) {
      const self = this;
      self.$data.loading = true;
      benefitService.duplicate(row.id).then(
        response => {
          self.$data.loading = false;
          if (response.status === 'ok') {
            this.$router.push(`/benefits/${response.message}/edit/`);
          } else {
            self.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
          }
        },
        () => {
          self.$data.loading = false;
        }
      );
    },
    toggleActive(row) {
      const self = this;
      self.$data.loading = true;
      benefitService.toggleActive(row.id).then(
        response => {
          if (response.status === 'ok') {
            row.active = response.data;
            self.$notify({
              type: 'success',
              message: `Benefício ${
                row.active ? 'ativado' : 'inativado'
              } com sucesso`
            });
            self.$data.loading = false;
          } else {
            self.$notify({
              type: 'danger',
              message: response.message
            });
          }
        },
        () => {
          self.$data.loading = false;
        }
      );
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
        idOperation: this.operationFilter
      };
      this.$data.loading = true;
      benefitService.findAll(request).then(
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
    validateModal() {
      const self = this;
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          self.modal.formLoading = true;
          benefitService.delete(self.modal.model.id).then(
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
    },
    confirmDelete(val) {
      const self = this;
      if (val) {
        this.$validator.validateAll().then(isValid => {
          if (isValid) {
            self.modal.formLoading = true;
            benefitService.delete(self.modal.model.id).then(
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
        self.resetModal();
      }
    }
  },
  watch: {
    activeFilter() {
      this.fetchData();
    },
    typeFilter() {
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
