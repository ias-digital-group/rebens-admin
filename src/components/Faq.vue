<template>
  <div class="row">
    <div class="col-12" v-if="showTable">
      <el-table
        ref="table"
        :data="tableData"
        v-loading="loading"
        :empty-text="$t('pages.faqs.emptytext')"
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
        <el-table-column
          :min-width="135"
          align="right"
          :label="$t('pages.faqs.grid.actions')"
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
        @click.native.prevent="newFaq"
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
          <label class="col-md-3 col-form-label">Pergunta</label>
          <div class="col-md-9">
            <base-input
              required
              v-model="model.question"
              type="text"
              :error="getError('question')"
              name="question"
              placeholder="Pergunta"
              maxlength="200"
            ></base-input>
            <label
              v-show="customErrors.includes('question')"
              class="text-danger"
              >&nbsp;&nbsp;O campo Pergunta é obrigatório.</label
            >
            <label
              v-show="customErrors.includes('questionMax')"
              class="text-danger"
              >&nbsp;&nbsp;O campo Pergunta aceita no máximo 200
              caracteres.</label
            >
          </div>
        </div>
        <div class="row">
          <label class="col-md-3 col-form-label">Resposta</label>
          <div class="col-md-9">
            <vue-editor
              :editorToolbar="customToolbar"
              v-model="model.answer"
              placeholder="Resposta"
            />
            <label v-show="customErrors.includes('answer')" class="text-danger"
              >&nbsp;&nbsp;O campo Resposta é obrigatório.</label
            >
          </div>
        </div>
        <div class="row">
          <label class="col-md-3 col-form-label">Ordem</label>
          <div class="col-md-2">
            <base-input
              required
              v-model="model.order"
              type="number"
              :error="getError('order')"
              name="order"
              placeholder="Ordem"
              maxlength="3"
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
              @click.native.prevent="validateFaq"
            >
              Salvar
            </base-button>
          </div>
        </div>
      </form>
    </div>
    <modal :show.sync="modal.visible" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Remover pergunta</h4>
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
import faqService from '../services/Faq/faqService';
import listPage from '../mixins/listPage';
import config from '../config';
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
      internalName: 'components.faqs.list',
      sortField: 'name',
      formLoading: false,
      showForm: false,
      showTable: false,
      customErrors: [],
      customToolbar: [],
      tableColumns: [
        {
          prop: 'id',
          label: this.$i18n.t('pages.faqs.grid.id'),
          minWidth: 0
        },
        {
          prop: 'question',
          label: this.$i18n.t('pages.faqs.grid.name'),
          minWidth: 200
        },
        {
          prop: 'order',
          label: this.$i18n.t('pages.faqs.grid.order'),
          minWidth: 0
        }
      ],
      model: {
        id: 0,
        question: '',
        answer: '',
        order: 0,
        idOperation: 0,
        active: true
      }
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    newFaq() {
      this.clearModel();
      this.showForm = true;
    },
    validateFaq() {
      const self = this;
      self.customErrors = [];
      if (self.model.question === '') {
        self.customErrors.push('question');
      } else if (self.model.question.length > 200) {
        self.customErrors.push('questionMax');
      }

      if (self.model.answer === '') {
        self.customErrors.push('answer');
      } 
      if (self.customErrors.length > 0) {
        return false;
      }
      self.submitLoading = true;
      self.saveFaq(self);
    },
    saveFaq(vm) {
      vm = vm ? vm : this;
      vm.model.idOperation = vm.parentId;
      if (vm.model.id === 0) {
        faqService.create(vm.model).then(
          () => {
            vm.$notify({
              type: 'success',
              message: 'Pergunta cadastrada com sucesso!',
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
        faqService.update(vm.model).then(
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
      this.model.active = obj.active;
      this.model.question = obj.question;
      this.model.answer = obj.answer;
      this.model.idOperation = obj.idOperation;
      this.model.id = obj.id;
      this.model.order = obj.order;
      this.formLoading = false;
    },
    fetchData() {
      const self = this;
      self.customToolbar = config.customToolbar;
      const request = {
        page: this.$data.pagination.currentPage - 1,
        pageItems: this.$data.pagination.perPage,
        searchWord: this.searchQuery,
        sort: this.formatSortFieldParam,
        idOperation: this.parentId
      };
      this.$data.loading = true;
      faqService.findAll(request).then(
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
          faqService.delete(self.modal.model.id).then(
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
      this.model.question = '';
      this.model.answer = '';
      this.model.order = 0;
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
