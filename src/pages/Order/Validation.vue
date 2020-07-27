<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Validação de Ingresso</h2>
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
                  class="bt c-light-gray"
                  v-if="!item.used"
                >
                  <i class="icon-icon-check"></i>
                </button>
                <span v-else>Utilizado</span>
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
