<template>
  <div class="list-box">
    <div class="page-header">
      <h2>Validação de Cupom</h2>
      <div class="box-actions">
        <div class="input-post-icon search">
          <input type="text" v-model="searchQuery" placeholder="Digite aqui o que deseja encontrar" />
          <i v-if="searchQuery === ''" class="icon-icon-search"></i>
          <i v-else class="bt-clear-search icon-icon-times c-red" @click="searchQuery = ''"></i>
        </div>
      </div>
    </div>
    <div class="list-table">
      <table v-loading="loading">
        <thead>
          <tr>
            <th>Nome</th>
            <th>cpf</th>
            <th>Parceiro</th>
            <th>Benefício</th>
            <th>Código</th>
            <th>Data de utilização</th>
            <th style="width:144px;">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in tableData" :key="item.id">
            <td>{{item.customerName}}</td>
            <td>{{item.customerCpf}}</td>
            <td>{{ item.partnerName }}</td>
            <td>{{item.benefitName}}</td>
            <td>{{item.code}}</td>
            <td>{{item.usedDate}}</td>
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
import benefitService from '../../services/Benefit/benefitService';
import paging from '../../mixins/paging';
export default {
  mixins: [paging],
  components: {
    Pagination
  },
  data() {
    return {
      internalName: 'pages.benefits.list',
      question: '',
      validateId: {},
      showValidateModal: false
    };
  },
  methods: {
    handleValidate(row) {
      this.validateId = row.id;
      this.question = `Tem certeza que deseja validar o ${row.benefitName}, código ${row.code} do cliente ${row.customerName}?`;
      this.showValidateModal = true;
    },
    closeValidateModal() {
      this.validateId = 0;
      this.question = '';
      this.showValidateModal = false;
    },
    confirmValidate() {
      const self = this;
      self.$data.loading = true;
      benefitService.validate(self.validateId).then(
        response => {
          if (response.status === 'ok') {
            self.$notify({
              type: 'success',
              message: 'Cupom validado com sucesso!'
            });
            self.fetchData();
          } else {
            self.$notify({
              type: 'danger',
              message: response.message
            });
          }
          self.$data.loading = false;
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
        idPartner: ''
      };
      this.$data.loading = true;
      benefitService.findAllToValidate(request).then(
        response => {
          self.$data.tableData = response.data;
          self.savePageSettings(self, response.totalItems);
          self.$data.loading = false;
        },
        () => {
          self.$data.loading = false;
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
