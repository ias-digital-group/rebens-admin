<template>
  <div class="row">
    <div class="col-12">
      <card card-body-classes="table-full-width">
        <template slot="header">
          <h4 class="card-title">
            Pré-cadastro
            <base-link
              to="/customers/new"
              class="btn btn-icon btn-simple btn-twitter btn-sm"
              ><i class="fas fa-plus"></i
            ></base-link>
          </h4>
        </template>
        <div>
          <div
            class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
          >
            <el-select
              class="select-primary mb-3 pagination-select"
              v-model="pagination.perPage"
              :placeholder="$t('pages.banners.perpage-placeholder')"
              v-if="!loading"
            >
              <el-option
                class="select-primary"
                v-for="item in pagination.perPageOptions"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <base-input>
              <el-input
                type="search"
                class="mb-3 search-input"
                style="width:300px"
                clearable
                prefix-icon="el-icon-search"
                placeholder="Procurar pré-cadastro"
                aria-controls="datatables"
                v-model="searchQuery"
              >
              </el-input>
            </base-input>
          </div>
          <el-table
            ref="table"
            :data="tableData"
            v-loading="loading"
            :empty-text="$t('pages.banners.emptytext')"
            @sort-change="onSortChanged"
            :default-sort="{ prop: sortField, order: sortOrder }"
          >
            <el-table-column
              v-for="column in tableColumns"
              :key="column.label"
              :min-width="column.minWidth"
              :prop="column.prop"
              :label="column.label"
              sortable="custom"
            >
            </el-table-column>
            <el-table-column :min-width="135" align="right" label="Ações">
              <div slot-scope="props">
                <base-button
                  @click.native="handleDelete(props.$index, props.row)"
                  class="remove btn-link"
                  type="danger"
                  size="sm"
                  icon
                >
                  <i class="fas fa-times"></i>
                </base-button>
              </div>
            </el-table-column>
          </el-table>
        </div>
        <div
          slot="footer"
          class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
        >
          <span
            class="btn btn-info mt-3 btn-simple btn-file"
            :loading="formLoading"
          >
            <span class="fileinput-new">Subir Lista</span>
            <input type="hidden" value="" name="" />
            <input
              accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              @change="uploadFile"
              type="file"
              name="..."
              class="valid"
              :multiple="false"
              aria-invalid="false"
              ref="file"
            />
          </span>
          <a
            href="/Exemplo-lista-clientes.xlsx"
            class="btn mt-3 btn-info btn-simple"
            >Exemplo arquivo excel</a
          >
          <base-pagination
            class="pagination-no-border mt-3"
            v-model="pagination.currentPage"
            :per-page="pagination.perPage"
            :total="total"
            v-on:input="onPageChanged"
          >
          </base-pagination>
        </div>
      </card>
    </div>
    <!-- Classic Modal -->
    <modal :show.sync="modal.visible" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Remover Pré-cadastro</h4>
      <form
        class="modal-form"
        ref="modalForm"
        @submit.prevent
        v-loading="modal.formLoading"
      >
        <input type="hidden" name="nome" value="DELETE" ref="nome" />
        <base-input
          required
          v-model="modal.nameConfirmation"
          label="Digite DELETE para confirmar"
          placeholder="Digite DELETE para confirmar"
          :error="getError('confirmação')"
          type="text"
          v-validate="modal.modelValidations.name_confirm"
          name="confirmação"
        >
        </base-input>
      </form>
      <template slot="footer">
        <base-button @click.native.prevent="validateModal" type="danger"
          >Remover</base-button
        >
        <base-button type="info" @click.native="modal.visible = false"
          >Fechar</base-button
        >
      </template>
    </modal>
  </div>
</template>
<script>
import { Table, TableColumn, Select, Option } from 'element-ui';
import { BasePagination, Modal } from 'src/components';
import operationService from '../../services/Operation/operationService';
import listPage from '../../mixins/listPage';
export default {
  mixins: [listPage],
  components: {
    Modal,
    BasePagination,
    [Select.name]: Select,
    [Option.name]: Option,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      internalName: 'Pré-cadastro',
      sortField: 'name',
      formLoading: false,
      tableColumns: [
        {
          prop: 'name',
          label: 'Nome'
        },
        {
          prop: 'cpf',
          label: 'CPF'
        },
        {
          prop: 'phone',
          label: 'Telefone'
        },
        {
          prop: 'cellphone',
          label: 'Celular'
        },
        {
          prop: 'email1',
          label: 'E-mail 1'
        },
        {
          prop: 'email2',
          label: 'E-mail 2'
        }
      ]
    };
  },
  methods: {
    fetchData() {
      const self = this;
      const request = {
        page: this.$data.pagination.currentPage - 1,
        pageItems: this.$data.pagination.perPage,
        searchWord: this.searchQuery,
        sort: this.formatSortFieldParam,
        parentId: this.$store.getters.currentUser.idOperation
      };
      this.$data.loading = true;
      operationService.findAllCustomers(request).then(
        response => {
          self.$data.tableData = response.data;
          if (response.data) {
            self.showForm = false;
            self.showTable = response.data.length > 0;
          } else {
            self.showForm = false;
            self.showTable = false;
          }
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
      this.$validator.validateAll('modalScope').then(isValid => {
        if (isValid) {
          self.modal.formLoading = true;
          operationService
            .deleteCustomer(
              self.$store.getters.currentUser.idOperation,
              self.modal.model.id
            )
            .then(
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
    uploadFile(event) {
      if (event.target.files.length == 0) {
        return;
      }
      const self = this;
      self.formLoading = true;
      let file = event.target.files[0];
      operationService
        .uploadCustomerList(self.$store.getters.currentUser.idOperation, file)
        .then(
          response => {
            self.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
            self.resetModal();
            self.pagination.currentPage = 1;
            self.fetchData();
            self.formLoading = false;
          },
          err => {
            self.$notify({
              type: 'primary',
              message: err.message,
              icon: 'tim-icons icon-bell-55'
            });
            self.formLoading = false;
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
