<template>
  <div class="row">
    <div class="col-12" v-if="showTable">
      <el-table
        ref="table"
        :data="tableData"
        v-loading="loading"
        :empty-text="$t('pages.operationPartners.emptytext')"
        @sort-change="onSortChanged"
        :default-sort="{ prop: sortField, order: sortOrder }"
      >
        <el-table-column
          v-for="column in tableColumns"
          :key="column.label"
          :min-width="column.minWidth"
          :prop="column.prop"
          :label="column.label"
          :formatter="renderValue"
          sortable="custom"
        >
        </el-table-column>
        <el-table-column
          :min-width="135"
          align="right"
          :label="$t('pages.operationPartners.grid.actions')"
        >
          <div slot-scope="props">
            <base-button
              @click.native="handleEdit(props.$index, props.row)"
              class="edit btn-link"
              type="info"
              size="sm"
              icon
            >
              <i class="tim-icons icon-pencil"></i>
            </base-button>
            <base-button
              @click.native="handleDelete(props.$index, props.row)"
              class="remove btn-link"
              type="danger"
              size="sm"
              icon
            >
              <i class="tim-icons icon-simple-remove"></i>
            </base-button>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <div
      class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
    >
      <base-button
        class="mt-3 pull-right"
        native-type="button"
        type="info"
        @click.native.prevent="newPartner"
        v-show="!showForm"
      >
        Novo
      </base-button>
      <base-pagination
        v-show="showTable"
        class="pagination-no-border"
        v-model="pagination.currentPage"
        :per-page="pagination.perPage"
        :total="total"
        v-on:input="onPageChanged"
      >
      </base-pagination>
    </div>
    <div class="col-12" v-if="showForm">
      <hr />
      <form class="form-horizontal" v-loading="formLoading" @submit.prevent>
        <div class="row">
          <label class="col-md-3 col-form-label">Nome</label>
          <div class="col-md-9">
            <base-input
              required
              v-model="model.name"
              type="text"
              :error="getError('name')"
              name="name"
              placeholder="Nome"
              maxlength="300"
            ></base-input>
          </div>
        </div>
        <div class="row">
          <label class="col-md-3 col-form-label">Ativo</label>
          <div class="col-md-9">
            <div class="form-group">
              <base-checkbox v-model="model.active">&nbsp;</base-checkbox>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <a class="btn mt-3 btn-secondary btn-simple" @click="clearModel()"
              >Cancelar</a
            >
            <base-button
              class="mt-3 pull-right"
              native-type="submit"
              type="info"
              @click.native.prevent="validatePartner"
            >
              Salvar
            </base-button>
          </div>
        </div>
      </form>
    </div>
    <modal :show.sync="modal.visible" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Remover parceiro</h4>
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
import operationPartnerService from '../services/OperationPartner/operationPartnerService';
import listPage from '../mixins/listPage';
import _ from 'lodash';

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
  props: {
    parent: String,
    parentId: [String, Number]
  },
  data() {
    return {
      internalName: 'partners',
      sortField: 'name',
      formLoading: false,
      showForm: false,
      showTable: false,
      tableColumns: [
        {
          prop: 'id',
          label: 'Id',
          minWidth: 0
        },
        {
          prop: 'name',
          label: 'Nome',
          minWidth: 300
        },
        {
          prop: 'active',
          label: 'Status'
        }
      ],
      model: {
        id: 0,
        name: '',
        idOperation: 0,
        active: true
      }
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    newPartner() {
      this.clearModel();
      this.showForm = true;
    },
    validatePartner() {
      const self = this;
      if (self.model.name !== '' && self.model.name.length <= 300) {
        self.submitLoading = true;
        self.savePartner(self);
      }
    },
    renderValue(row, column, cellValue) {
      return column.property === 'active'
        ? cellValue
          ? 'ativo'
          : 'inativo'
        : cellValue;
    },
    savePartner(vm) {
      vm = vm ? vm : this;
      vm.model.idOperation = vm.parentId;
      if (vm.model.id === 0) {
        operationPartnerService.create(vm.model).then(
          () => {
            vm.$notify({
              type: 'success',
              message: 'Parceiro com sucesso!',
              icon: 'tim-icons icon-bell-55'
            });
            vm.clearModel();
            vm.submitLoading = false;
            vm.fetchData();
          },
          err => {
            vm.$notify({
              type: 'primary',
              message: err.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.submitLoading = false;
          }
        );
      } else {
        operationPartnerService.update(vm.model).then(
          response => {
            vm.$notify({
              type: 'primary',
              message: response.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.clearModel();
            vm.submitLoading = false;
            vm.fetchData();
          },
          err => {
            vm.$notify({
              type: 'primary',
              message: err.message,
              icon: 'tim-icons icon-bell-55'
            });
            vm.submitLoading = false;
          }
        );
      }
    },
    handleEdit(index, row) {
      this.formLoading = true;
      this.clearModel();
      this.showForm = true;
      let obj = _.cloneDeep(row);
      this.model.name = obj.name;
      this.model.idOperation = obj.idOperation;
      this.model.id = obj.id;
      this.model.active = obj.active;
      this.formLoading = false;
    },
    fetchData() {
      const self = this;
      const request = {
        page: this.$data.pagination.currentPage - 1,
        pageItems: this.$data.pagination.perPage,
        searchWord: this.searchQuery,
        sort: this.formatSortFieldParam,
        idOperation: this.parentId
      };
      this.$data.loading = true;
      operationPartnerService.findAll(request).then(
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
    validateModal() {
      const self = this;
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          self.modal.formLoading = true;
          operationPartnerService.delete(self.modal.model.id).then(
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
    clearModel() {
      this.model.id = 0;
      (this.model.idOperation = 0), (this.model.active = false);
      this.model.name = '';
      this.$validator.reset();
      this.showForm = false;
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
