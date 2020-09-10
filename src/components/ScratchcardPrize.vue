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
          v-if="canEdit"
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
              <i class="fas fa-edit"></i>
            </base-button>
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
      v-if="canEdit"
      class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
    >
      <base-button
        class="mt-3 pull-right"
        native-type="button"
        type="info"
        @click.native.prevent="newPrize"
        v-show="!showForm"
      >
        Novo
      </base-button>
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
              maxlength="200"
            ></base-input>
            <label v-show="customErrors.includes('name')" class="text-danger"
              >O campo Nome é obrigatório.</label
            >
            <label v-show="customErrors.includes('nameMax')" class="text-danger"
              >O campo Nome aceita no máximo 200 caracteres.</label
            >
          </div>
        </div>
        <div class="row">
          <label class="col-md-3 col-form-label">Título</label>
          <div class="col-md-9">
            <base-input
              required
              v-model="model.title"
              type="text"
              :error="getError('title')"
              name="title"
              placeholder="Título"
              maxlength="200"
            ></base-input>
            <label v-show="customErrors.includes('title')" class="text-danger"
              >O campo Título é obrigatório.</label
            >
            <label
              v-show="customErrors.includes('titleMax')"
              class="text-danger"
              >O campo Título aceita no máximo 200 caracteres.</label
            >
          </div>
        </div>
        <div class="row">
          <label class="col-md-3 col-form-label">Descrição</label>
          <div class="col-md-9">
            <vue-editor
              :editorToolbar="customToolbar"
              v-model="model.description"
              placeholder="Descrição"
            />

            <label v-show="customErrors.includes('desc')" class="text-danger"
              >O campo Descrição é obrigatório.</label
            >
            <label v-show="customErrors.includes('descMax')" class="text-danger"
              >O campo Descrição aceita no máximo 2000 caracteres.</label
            >
          </div>
        </div>
        <div class="row">
          <label class="col-md-3 col-form-label">Quantidade</label>
          <div class="col-md-2">
            <base-input
              v-model="model.quantity"
              type="number"
              name="quantity"
              placeholder="Quantidade"
              maxlength="10"
            ></base-input>
            <label v-show="customErrors.includes('qty')" class="text-danger"
              >O campo Quantidade é obrigatório.</label
            >
          </div>
        </div>
        <div class="row">
          <label class="col-md-3 col-form-label"
            >Imagem do prêmio <br />
            <span>(200x200)</span>
          </label>
          <div class="col-md-9">
            <template v-if="model.image">
              <div class="fileinput">
                <div class="thumbnail">
                  <img :src="model.image" class="img-preview" />
                </div>
                <div>
                  <base-button
                    @click="model.image = ''"
                    class="btn-simple btn-file"
                    type="danger"
                  >
                    <i class="fas fa-times"></i> {{ removeText }}
                  </base-button>
                </div>
              </div>
            </template>
            <template v-else>
              <image-upload
                @change="onImageChange"
                change-text="Alterar"
                remove-text="Remover"
                select-text="Selecione uma imagem"
              />
            </template>
            <br />
            <label v-show="customErrors.includes('image')" class="text-danger"
              >O campo Imagem é obrigatório.</label
            >
            <label
              v-show="customErrors.includes('imageMax')"
              class="text-danger"
              >O campo Imagem aceita até 500 caracteres.</label
            >
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
              @click.native.prevent="validatePrize"
            >
              Salvar
            </base-button>
          </div>
        </div>
      </form>
    </div>
    <modal :show.sync="modal.visible" headerClasses="justify-content-center">
      <h4 slot="header" class="title title-up">Remover prêmio</h4>
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
import scratchcardPrizeService from '../services/Scratchcard/scratchcardPrizeService';
import scratchcardService from '../services/Scratchcard/scratchcardService';
import { ImageUpload } from 'src/components/index';
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
    ImageUpload,
    [TableColumn.name]: TableColumn
  },
  props: {
    canEdit: Boolean,
    parentId: [String, Number]
  },
  data() {
    return {
      internalName: 'components.scratchcardPrizes.list',
      sortField: 'name',
      formLoading: false,
      showForm: false,
      showTable: false,
      image: null,
      customErrors: [],
      customToolbar: [],
      tableColumns: [
        {
          prop: 'id',
          label: 'ID',
          minWidth: 0
        },
        {
          prop: 'name',
          label: 'Nome',
          minWidth: 100
        },
        {
          prop: 'title',
          label: 'Título',
          minWidth: 100
        },
        {
          prop: 'quantity',
          label: 'QTD',
          minWidth: 30
        }
      ],
      model: {
        id: 0,
        name: '',
        title: '',
        image: '',
        idScratchcard: 0,
        quantity: 0,
        description: ''
      }
    };
  },
  methods: {
    getError(fieldName) {
      return this.errors.first(fieldName);
    },
    newPrize() {
      this.clearModel();
      this.showForm = true;
    },
    validatePrize() {
      const self = this;
      self.customErrors = new Map();
      if (self.model.name == '') {
        self.customErrors.set('name', 'Campo obrigatório');
      } else if (self.model.name.length > 200) {
        self.customErrors.set(
          'name',
          'Este campo aceita no máximo 200 caracteres'
        );
      }
      if (self.model.image == '' && self.image == null) {
        self.customErrors.set('image', 'Campo obrigatório');
      }
      if (self.model.title == '') {
        self.customErrors.set('title', 'Campo obrigatório');
      } else if (self.model.title.length > 200) {
        self.customErrors.set(
          'title',
          'Este campo aceita no máximo 200 caracteres'
        );
      }
      if (self.model.quantity <= 0) {
        self.customErrors.set('quantity', 'Campo obrigatório');
      }
      if (self.model.description == '') {
        self.customErrors.set('description', 'Campo obrigatório');
      } else if (self.model.description.length > 2000) {
        self.customErrors.set(
          'description',
          'Este campo aceita no máximo 2000 caracteres'
        );
      }

      if (self.customErrors.size === 0) {
        self.submitLoading = true;
        if (self.image) {
          scratchcardService.uploadImage(self.image).then(
            response => {
              if (response.status != 200) {
                self.$notify({
                  type: 'primary',
                  message: response.message,
                  icon: 'tim-icons icon-bell-55'
                });
                self.submitLoading = false;
                return;
              }
              self.model.image = response.data.fileName;
              self.savePrize(self);
            },
            err => {
              self.$notify({
                type: 'warning',
                message: err.message,
                icon: 'tim-icons icon-bell-55'
              });
              self.submitLoading = false;
            }
          );
        }
      } else if (self.model.image !== '') {
        self.savePrize(self);
      }
    },
    savePrize(vm) {
      vm = vm ? vm : this;
      vm.model.idOperation = vm.parentId;
      if (vm.model.id === 0) {
        scratchcardPrizeService.create(vm.model).then(
          () => {
            vm.$notify({
              type: 'success',
              message: 'Prêmio cadastrado com sucesso!',
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
        scratchcardPrizeService.update(vm.model).then(
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
      this.model.title = obj.title;
      this.model.description = obj.description;
      this.model.idScratchcard = obj.idScratchcard;
      this.model.id = obj.id;
      this.model.quantity = obj.quantity;
      this.model.image = obj.image;
      this.formLoading = false;
    },
    fetchData() {
      const self = this;
      self.customToolbar = config.customToolbar;
      self.$data.loading = true;
      scratchcardPrizeService.list(self.parentId).then(
        response => {
          self.$data.tableData = response.data;
          self.$data.loading = false;
          self.showTable = response.data.length > 0;
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
          scratchcardPrizeService.delete(self.modal.model.id).then(
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
    onImageChange(file) {
      this.image = file;
    },
    clearModel() {
      this.model.id = 0;
      this.model.idScratchcard = this.parentId;
      this.model.name = '';
      this.model.title = '';
      this.model.description = '';
      this.model.image = '';
      this.model.quantity = 0;
      this.$validator.reset();
      this.showForm = false;
    }
  },
  created() {
    this.fetchData();
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
