<template>
  <div class="row">
    <div class="col-12" v-if="showTable">
      <el-table
        ref="customersTable"
        :data="tableData"
        v-loading="loading"
        empty-text="..."
      >
        <el-table-column
          v-for="column in tableColumns"
          :key="column.label"
          :min-width="column.minWidth"
          :prop="column.prop"
          :label="column.label"
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
              <i class="tim-icons icon-simple-remove"></i>
            </base-button>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <div
      class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
      v-if="showTable"
    >
      <div class="">
        <el-select
          class="select-primary mb-3 pagination-select"
          v-model="pagination.perPage"
          placeholder="Por página"
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
      </div>
      <base-pagination
        class="pagination-no-border"
        v-model="pagination.currentPage"
        :per-page="pagination.perPage"
        :total="total"
        v-on:input="onPageChanged"
      >
      </base-pagination>
    </div>
    <div
      class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
      v-if="!showForm"
    >
      <span
        class="btn btn-info mt-3 btn-simple"
        disabled
        v-show="showFileInfo"
        >{{ fileInfoText }}</span
      >
      <span
        class="btn btn-info mt-3 btn-simple btn-file"
        v-show="showUploadButton"
        v-loading="uploadLoading"
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
      <a class="btn mt-3 btn-success btn-simple" @click="showForm = true"
        >Adicionar</a
      >
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
              v-validate="modelValidations.nome"
              type="text"
              :error="getError('nome')"
              name="nome"
              placeholder="Nome"
              maxlength="300"
            ></base-input>
          </div>
        </div>
        <div class="row">
          <label class="col-md-3 col-form-label">CPF</label>
          <div class="col-md-5">
            <base-input
              required
              v-model="model.cpf"
              v-validate="modelValidations.cpf"
              type="text"
              :error="getError('cpf')"
              name="cpf"
              placeholder="CPF"
              masked="true"
              :inputMask="['###.###.###-##']"
              maxlength="50"
            ></base-input>
          </div>
        </div>
        <div class="row">
          <label class="col-md-3 col-form-label">Telefones</label>
          <div class="col-md-9 col-lg-4">
            <base-input
              label="Fixo"
              type="tel"
              placeholder="Telefone"
              v-model="model.phone"
              ref="phone"
              masked="true"
              :inputMask="['(##) ####-####']"
            >
            </base-input>
          </div>
          <div class="col-md-9 offset-md-3 offset-lg-0 col-lg-5">
            <base-input
              required
              label="Celular"
              v-validate="modelValidations.celular"
              :error="getError('celular')"
              name="celular"
              type="tel"
              ref="cellPhone"
              placeholder="Celular"
              v-model="model.cellPhone"
              masked="true"
              :inputMask="['(##) ####-####', '(##) #####-####']"
            >
            </base-input>
          </div>
        </div>

        <div class="row">
          <label class="col-md-3 col-form-label">E-mail 1</label>
          <div class="col-md-5">
            <base-input
              required
              v-model="model.email1"
              v-validate="modelValidations.email1"
              type="email"
              :error="getError('email1')"
              name="email1"
              placeholder="email1"
              maxlength="500"
            ></base-input>
          </div>
        </div>
        <div class="row">
          <label class="col-md-3 col-form-label">E-mail 2</label>
          <div class="col-md-5">
            <base-input
              required
              v-model="model.email2"
              v-validate="modelValidations.email2"
              type="email"
              :error="getError('email2')"
              name="email2"
              placeholder="email2"
              maxlength="500"
            ></base-input>
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
              @click.native.prevent="validateCustomer"
            >
              Salvar
            </base-button>
          </div>
        </div>
      </form>
    </div>
    <modal :show.sync="modal.visible" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Remover Pré Cadastro</h4>
      <form
        class="modal-form"
        ref="modalForm"
        @submit.prevent
        v-loading="modal.formLoading"
        data-vv-scope="modalScope"
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
import { Table, TableColumn } from 'element-ui';
import { BasePagination } from 'src/components';
import Modal from 'src/components/Modal.vue';
import operationService from '../services/Operation/operationService';
import listPage from '../mixins/listPage';

export default {
  mixins: [listPage],
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    BasePagination,
    [Modal.name]: Modal
  },
  props: {
    parent: String,
    parentId: [String, Number]
  },
  data() {
    return {
      formLoading: false,
      internalName: 'components.customers.list',
      sortField: 'name',
      showForm: false,
      showTable: false,
      showUploadButton: false,
      showFileInfo: false,
      uploadLoading: false,
      fileInfoText: '',
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
      ],
      model: {
        id: 0,
        name: '',
        cpf: '',
        phone: '',
        cellPhone: null,
        email1: '',
        email2: ''
      },
      modelValidations: {
        nome: {
          required: true,
          max: 300
        },
        cpf: {
          max: 50,
          required: true
        },
        phone: {
          max: 50
        },
        cellPhone: {
          max: 50
        },
        email1: {
          max: 500
        },
        email2: {
          max: 500
        }
      }
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
        parentId: this.parentId,
        parent: this.parent
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

      operationService.checkFileProcessing(this.parentId).then(response => {
        if (response.status == 'ok') {
          self.fileInfoText = response.message;
          self.showUploadButton = false;
          self.showFileInfo = true;
        } else {
          self.showUploadButton = true;
          self.showFileInfo = false;
          self.fileInfoText = '';
        }
      });
    },
    validateCustomer() {
      const self = this;
      if (
        self.model.name !== '' &&
        self.model.name.length <= 300 &&
        self.model.cpf !== '' &&
        self.model.cpf.length <= 500
      ) {
        self.submitLoading = true;
        self.saveCustomer(self);
      }
    },
    saveCustomer() {
      const self = this;
      this.$validator.validateAll().then(isValid => {
        if (isValid) {
          self.formLoading = true;
          operationService.createCustomer(self.parentId, self.model).then(
            response => {
              self.$notify({
                type: 'primary',
                message: response
                  ? response.message
                  : 'Cliente pré cadastrado com sucesso.',
                icon: 'tim-icons icon-bell-55'
              });
              self.clearModel();
              self.formLoading = false;
              self.fetchData();
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
      });
    },
    validateModal() {
      const self = this;
      this.$validator.validateAll('modalScope').then(isValid => {
        if (isValid) {
          self.modal.formLoading = true;
          operationService
            .deleteCustomer(self.parentId, self.modal.model.id)
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
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    uploadFile(event) {
      if (event.target.files.length == 0) {
        return;
      }
      const self = this;
      self.uploadLoading = true;
      let file = event.target.files[0];
      operationService.uploadCustomerList(self.parentId, file).then(
        response => {
          self.$notify({
            type: 'primary',
            message: response.message,
            icon: 'tim-icons icon-bell-55'
          });
          self.resetModal();
          self.pagination.currentPage = 1;
          self.fetchData();
          self.uploadLoading = false;
        },
        err => {
          self.$notify({
            type: 'primary',
            message: err.message,
            icon: 'tim-icons icon-bell-55'
          });
          self.uploadLoading = false;
        }
      );
    },
    clearModel() {
      this.model.id = 0;
      this.model.name = '';
      this.model.cpf = '';
      this.model.phone = null;
      this.model.cellPhone = null;
      this.model.email1 = null;
      this.model.email2 = null;
      this.$validator.reset();
      this.showForm = false;
    },
    created() {
      this.modal.visible = false;
    }
  }
};
</script>
