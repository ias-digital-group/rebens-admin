<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Clientes</h2>
    </div>
    <div class="list-table">
      <table v-loading="loading">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail / CPF</th>
            <th>Parceiro / Status</th>
            <th style="width:144px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>{{ item.name }}</td>
            <td>
              <div class="two-lines">
                <span>{{ item.email }}</span>
                <span class="blue">{{ item.cpf }}</span>
              </div>
            </td>
            <td>
              <div class="two-lines">
                <span>{{ item.operationPartnerName }}</span>
                <span class="blue">{{ item.statusName }}</span>
              </div>
            </td>
            <td>
              <div class="actions">
                <button
                  type="button"
                  :title="item.active ? 'Inativar' : 'Ativar'"
                  class="bt c-green"
                  v-show="item.status == 1 || item.status == 3"
                  @click.native="approve(item)"
                >
                  <i class="icon-icon-check"></i>
                </button>
                <button
                  v-show="item.status == 1"
                  @click.native="disapprove(item)"
                  type="button"
                  title="Editar"
                  class="bt c-red"
                >
                  <i class="icon-icon-times"></i>
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
import { Select, Option } from 'element-ui';
import { Pagination } from 'src/components';
import operationPartnerService from '../../services/OperationPartner/operationPartnerService';
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
      internalName: 'Parceiros',
      sortField: 'name',
      formLoading: false
    };
  },
  methods: {
    fetchData() {
      const self = this;
      const request = {
        page: self.$data.pagination.currentPage - 1,
        pageItems: self.$data.pagination.perPage,
        searchWord: self.searchQuery,
        sort: self.formatSortFieldParam,
        idOperation: self.$store.getters.currentUser.idOperation,
        status: 1,
        idOperationPartner: self.$store.getters.currentUser.idOperationPartner
      };
      self.$data.loading = true;
      operationPartnerService.findAllCustomers(request).then(
        response => {
          self.$data.tableData = response.data;
          self.savePageSettings(self, response.totalItems);
          self.$data.loading = false;
          self.showTable = response.totalItems > 0;
        },
        () => {
          self.$data.loading = false;
        }
      );
    },
    approve(row) {
      const self = this;
      operationPartnerService
        .changeCustomerStatus({ id: row.id, status: 2 })
        .then(
          () => {
            self.$notify({
              type: 'success',
              message: 'Cliente aprovado com sucesso!'
            });
            row.status = 2;
            row.statusName = 'aprovado';
          },
          err => {
            self.$notify({
              type: 'danger',
              message: err.message
            });
          }
        );
    },
    disapprove(row) {
      const self = this;
      operationPartnerService
        .changeCustomerStatus({ id: row.id, status: 3 })
        .then(
          () => {
            self.$notify({
              type: 'success',
              message: 'Cliente reprovado com sucesso!'
            });
            row.status = 3;
            row.statusName = 'reprovado';
          },
          err => {
            self.$notify({
              type: 'danger',
              message: err.message
            });
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
