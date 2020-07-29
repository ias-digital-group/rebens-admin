<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Clientes</h2>
    </div>
    <div class="list-table" v-loading="loading">
      <table>
        <thead>
          <tr>
            <th>Nome / E-mail</th>
            <th>CPF</th>
            <th>Parceiro / Status</th>
            <th style="width:124px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>
              <div class="two-lines">
                <span>{{ item.name }}</span>
                <span class="blue">{{ item.email }}</span>
              </div>
            </td>
            <td>{{ item.cpf }}</td>
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
                  title="Ativar"
                  class="bt bt-check c-dark-gray"
                  v-if="item.status == 1"
                  @click="approve(item)"
                >
                  <svg
                    width="24"
                    height="18"
                    viewBox="0 0 24 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23.9017 2.62515L9.02125 17.5056C8.89018 17.6367 8.67796 17.6367 8.5472 17.5056L0.0980729 9.05616C-0.032691 8.92571 -0.032691 8.71348 0.0980729 8.58241L2.1511 6.52939C2.28217 6.39863 2.49439 6.39863 2.62515 6.52939L8.78453 12.6885L21.3749 0.0980729C21.5063 -0.032691 21.7179 -0.032691 21.849 0.0980729L23.9017 2.1511C24.0328 2.28186 24.0328 2.49378 23.9017 2.62515Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                <span v-else-if="item.status === 2" class="c-green">
                  <svg
                    width="24"
                    height="18"
                    viewBox="0 0 24 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23.9017 2.62515L9.02125 17.5056C8.89018 17.6367 8.67796 17.6367 8.5472 17.5056L0.0980729 9.05616C-0.032691 8.92571 -0.032691 8.71348 0.0980729 8.58241L2.1511 6.52939C2.28217 6.39863 2.49439 6.39863 2.62515 6.52939L8.78453 12.6885L21.3749 0.0980729C21.5063 -0.032691 21.7179 -0.032691 21.849 0.0980729L23.9017 2.1511C24.0328 2.28186 24.0328 2.49378 23.9017 2.62515Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <button
                  v-if="item.status == 1"
                  @click="disapprove(item)"
                  type="button"
                  title="Editar"
                  class="bt c-dark-gray"
                >
                  <i class="icon-icon-times"></i>
                </button>
                <span v-else-if="item.status === 3" class="c-red">
                  <i class="icon-icon-times"></i>
                </span>
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
      self.loading = true;
      operationPartnerService.findAllCustomers(request).then(
        response => {
          self.$data.tableData = response.data;
          self.savePageSettings(self, response.totalItems, response.totalPages);
          self.loading = false;
          self.showTable = response.totalItems > 0;
        },
        () => {
          self.loading = false;
        }
      );
    },
    approve(row) {
      const self = this;
      self.loading = true;
      operationPartnerService
        .changeCustomerStatus({ id: row.id, status: 2 })
        .then(
          () => {
            self.loading = false;
            self.$notify({
              type: 'success',
              message: 'Cliente aprovado com sucesso!'
            });
            row.status = 2;
            row.statusName = 'aprovado';
          },
          err => {
            self.loading = false;
            self.$notify({
              type: 'danger',
              message: err.message
            });
          }
        );
    },
    disapprove(row) {
      const self = this;
      self.loading = true;
      operationPartnerService
        .changeCustomerStatus({ id: row.id, status: 3 })
        .then(
          () => {
            self.loading = false;
            self.$notify({
              type: 'success',
              message: 'Cliente reprovado com sucesso!'
            });
            row.status = 3;
            row.statusName = 'reprovado';
          },
          err => {
            self.loading = false;
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
