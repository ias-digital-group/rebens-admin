<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Validação de Ingresso</h2>
      <div class="box-actions" style="padding-top: 8px;">
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
            <th>Nome</th>
            <th>Cpf</th>
            <th>Produto</th>
            <th>Código</th>
            <th>Data utilização</th>
            <th style="width:64px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>{{ item.customerName }}</td>
            <td>{{ item.customerCpf }}</td>
            <td>{{ item.itemName }}</td>
            <td>{{ item.voucher }}</td>
            <td>{{ item.usedDate }}</td>
            <td>
              <div class="actions">
                <button
                  @click="handleValidate(item)"
                  type="button"
                  title="Validar"
                  class="bt c-dark-gray"
                  v-if="!item.used"
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
                <span class="c-green" v-else>
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
    <confirm-modal
      @closeModal="closeValidateModal"
      :question="question"
      :show="showValidateModal"
      @confirm="confirmValidate"
    ></confirm-modal>
  </div>
</template>
<script>
import { Pagination, ConfirmModal } from 'src/components';
import orderService from '../../services/Order/orderService';
import paging from '../../mixins/paging';
export default {
  mixins: [paging],
  components: {
    Pagination,
    ConfirmModal
  },
  data() {
    return {
      internalName: 'Validação de Ingressos',
      question: '',
      validateId: {},
      showValidateModal: false
    };
  },
  methods: {
    handleValidate(item) {
      this.validateId = item.id;
      this.question = `Tem certeza que deseja validar o ${item.itemName}, código ${item.voucher} do cliente ${item.customerName}?`;
      this.showValidateModal = true;
    },
    closeValidateModal() {
      this.validateId = 0;
      this.question = '';
      this.showValidateModal = false;
    },
    confirmValidate() {
      const self = this;
      self.loading = false;
      orderService.validate(self.validateId).then(
        response => {
          if (response.status === 'ok') {
            self.closeValidateModal();
            self.$notify({
              type: 'success',
              message: 'Ingresso validado com sucesso!'
            });
          } else {
            self.closeValidateModal();
            self.$notify({
              type: 'danger',
              message: response.message
            });
          }
          self.loading = false;
        },
        () => {
          self.loading = false;
        }
      );
    },
    fetchData() {
      const self = this;
      const request = {
        page: this.$data.pagination.currentPage - 1,
        pageItems: this.$data.pagination.perPage,
        searchWord: this.searchQuery,
        idOperation: ''
      };
      self.loading = true;
      orderService.findAllToValidate(request).then(
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
